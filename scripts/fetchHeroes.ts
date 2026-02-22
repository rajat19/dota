import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../src/data');

// ─── Types ──────────────────────────────────────────────

interface OpenDotaHero {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    roles: string[];
    img: string;
    icon: string;
    base_health: number;
    base_mana: number;
    base_armor: number;
    move_speed: number;
    base_attack_min: number;
    base_attack_max: number;
    base_str: number;
    base_agi: number;
    base_int: number;
    str_gain: number;
    agi_gain: number;
    int_gain: number;
    attack_range: number;
    attack_rate: number;
    projectile_speed: number;
}

// ─── Helpers ────────────────────────────────────────────

function toSlug(name: string): string {
    return name.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

function fetchJSON<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', (chunk: string) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data) as T); }
                catch { reject(new Error(`Failed to parse JSON from ${url}`)); }
            });
        }).on('error', reject);
    });
}

function sleep(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}

// Strip API template placeholders like {s:variable_name} and %variable%
function cleanText(text: string): string {
    return text
        .replace(/\+?\{s:[^}]+\}/g, '')   // {s:var} or +{s:var}
        .replace(/%[^%\s]+%/g, '')          // %variable%
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── Main ───────────────────────────────────────────────

async function run(): Promise<void> {
    // Step 1: Fetch hero list from OpenDota
    console.log('📡 Fetching hero stats from OpenDota API...');
    const opendotaStats = await fetchJSON<OpenDotaHero[]>('https://api.opendota.com/api/heroStats');
    console.log(`   Found ${opendotaStats.length} heroes`);

    // Step 2: Build base hero list from OpenDota
    const heroList: Record<string, unknown>[] = [];
    for (const stats of opendotaStats) {
        const key = toSlug(stats.localized_name);
        heroList.push({
            key,
            id: stats.id,
            name: stats.localized_name,
            primaryAttr: stats.primary_attr,
            attackType: stats.attack_type,
            roles: stats.roles,
            image: `https://steamcdn-a.akamaihd.net${stats.img}`,
            icon: `https://steamcdn-a.akamaihd.net${stats.icon}`,
            baseHealth: stats.base_health,
            baseMana: stats.base_mana,
            baseArmor: stats.base_armor,
            baseMoveSpeed: stats.move_speed,
            baseAttackMin: stats.base_attack_min,
            baseAttackMax: stats.base_attack_max,
            baseStr: stats.base_str,
            baseAgi: stats.base_agi,
            baseInt: stats.base_int,
            strGain: stats.str_gain,
            agiGain: stats.agi_gain,
            intGain: stats.int_gain,
            attackRange: stats.attack_range,
            attackRate: stats.attack_rate,
            projectileSpeed: stats.projectile_speed,
            bio: '',
            hype: '',
            complexity: 0,
            abilities: [] as unknown[],
            talents: [] as unknown[],
            facets: [] as unknown[],
        });
    }

    // Step 4: Enrich each hero from Dota2.com official API
    console.log('\n🎮 Fetching detailed hero data from dota2.com...');
    let enriched = 0;
    let failed = 0;

    for (const hero of heroList) {
        try {
            const url = `https://www.dota2.com/datafeed/herodata?language=english&hero_id=${hero.id}`;
            const response = await fetchJSON<Record<string, unknown>>(url);
            const result = response?.result as Record<string, unknown> | undefined;
            const data = result?.data as Record<string, unknown> | undefined;
            const heroes = data?.heroes as Record<string, unknown>[] | undefined;
            const heroData = heroes?.[0];

            if (heroData) {
                hero.bio = (heroData.bio_loc as string) || '';
                hero.hype = ((heroData.hype_loc as string) || '').replace(/<\/?b>/g, '');
                hero.complexity = (heroData.complexity as number) || 0;

                // Abilities (skip innate)
                const rawAbilities = (heroData.abilities as Record<string, unknown>[]) || [];
                hero.abilities = rawAbilities
                    .filter(a => !(a.ability_is_innate as boolean))
                    .map(a => {
                        const specialValues = ((a.special_values as Record<string, unknown>[]) || [])
                            .filter(sv => sv.heading_loc && (sv.heading_loc as string) !== '')
                            .map(sv => ({
                                name: (sv.heading_loc as string).replace(/:/g, '').trim(),
                                values: sv.values_float,
                                isPercent: sv.is_percentage,
                            }));

                        return {
                            name: a.name_loc,
                            internalName: a.name,
                            description: a.desc_loc,
                            lore: a.lore_loc || '',
                            type: (a.type as number) === 1 ? 'ultimate' : 'active',
                            isPassive: a.behavior === '2',
                            pierceSpellImmunity: (a.immunity as number) === 3,
                            hasScepter: a.ability_has_scepter,
                            hasShard: a.ability_has_shard,
                            scepterDesc: a.scepter_loc || '',
                            shardDesc: a.shard_loc || '',
                            cooldown: ((a.cooldowns as number[]) || []).filter(c => c > 0),
                            manaCost: ((a.mana_costs as number[]) || []).filter(c => c > 0),
                            damage: ((a.damages as number[]) || []).filter(d => d > 0),
                            castRange: ((a.cast_ranges as number[]) || []).filter(r => r > 0),
                            specialValues,
                        };
                    });

                // Innate abilities
                const innate = rawAbilities.filter(a => a.ability_is_innate as boolean);
                if (innate.length > 0) {
                    (hero as Record<string, unknown>).innate = innate.map(a => ({
                        name: a.name_loc,
                        description: a.desc_loc,
                    }));
                }

                // Talents (8 talents = 4 levels × 2 choices)
                const rawTalents = (heroData.talents as Record<string, unknown>[]) || [];
                if (rawTalents.length >= 8) {
                    const levels = [10, 15, 20, 25];
                    hero.talents = levels.map((level, i) => ({
                        level,
                        left: cleanText((rawTalents[i * 2]?.name_loc as string) || ''),
                        right: cleanText((rawTalents[i * 2 + 1]?.name_loc as string) || ''),
                    }));
                }

                // Facets
                const rawFacets = (heroData.facets as Record<string, unknown>[]) || [];
                if (rawFacets.length > 0) {
                    hero.facets = rawFacets.map(f => ({
                        name: f.title_loc,
                        description: f.description_loc,
                        icon: f.icon,
                    }));
                }

                enriched++;
            } else {
                failed++;
                console.warn(`   ⚠️  No data for ${hero.name} (id: ${hero.id})`);
            }
        } catch (err) {
            failed++;
            console.warn(`   ❌ Failed to fetch ${hero.name}: ${(err as Error).message}`);
        }

        // Rate limit: 100ms between requests
        await sleep(100);

        if ((enriched + failed) % 20 === 0) {
            console.log(`   ... ${enriched + failed}/${heroList.length} processed`);
        }
    }

    console.log(`   ✅ Enriched ${enriched} heroes, ${failed} failed`);

    // Step 5: Write output
    const output = { heroes: heroList };
    fs.writeFileSync(
        path.join(DATA_DIR, 'heroesList.json'),
        JSON.stringify(output, null, 2)
    );
    console.log(`\n✨ Generated heroesList.json with ${heroList.length} enriched heroes`);
    console.log('   Counter data is loaded separately from counters.json at runtime.');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
