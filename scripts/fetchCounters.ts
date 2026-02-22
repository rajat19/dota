import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../src/data');

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroInfo {
    heronames: string[];
}

interface AdvScore {
    adv_rates: (null | [number, number, number])[][];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fetchJSON<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            let data = '';
            res.on('data', (chunk: string) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data) as T); }
                catch { reject(new Error(`Failed to parse JSON from ${url}`)); }
            });
        }).on('error', reject);
    });
}

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
}

// Map a dotapicker hero name → our slug format
// Some names differ slightly between dotapicker and OpenDota/our data
const DOTAPICKER_NAME_OVERRIDES: Record<string, string> = {
    'Natures Prophet': 'nature_s_prophet',
    'Outworld Devourer': 'outworld_destroyer',
};

function dpNameToSlug(dpName: string): string {
    if (DOTAPICKER_NAME_OVERRIDES[dpName]) return DOTAPICKER_NAME_OVERRIDES[dpName];
    return toSlug(dpName);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
    console.log('📡 Fetching hero info from dotapicker...');
    const heroInfo = await fetchJSON<HeroInfo>('https://dotapicker.com/assets/json/data/heroinfo.json');
    const heroNames = heroInfo.heronames;
    console.log(`   Found ${heroNames.length} heroes`);

    console.log('📡 Fetching advantage scores matrix...');
    const advData = await fetchJSON<AdvScore>('https://dotapicker.com/assets/json/data/heroadvscores.json');
    const matrix = advData.adv_rates;
    console.log(`   Matrix rows: ${matrix.length}`);

    // Load existing counters.json (preserve existing reason fields and counterItems)
    const countersPath = path.join(DATA_DIR, 'counters.json');
    let existing: Record<string, {
        strongAgainst?: string[];
        weakAgainst?: string[];
        counterItems?: string[];
        reason?: { strongAgainst: string; weakAgainst: string; itemCounters: string };
    }> = {};
    if (fs.existsSync(countersPath)) {
        const raw = JSON.parse(fs.readFileSync(countersPath, 'utf8'));
        existing = raw.heroCounters || {};
        console.log(`📖 Loaded existing counters for ${Object.keys(existing).length} heroes`);
    }

    // Build counter data for every hero
    // adv_rates[i][j] = [adv_normal, adv_pro, synergy] — hero i's advantage vs hero j
    // Positive = hero i advantages over hero j
    // So: heroes that counter hero X = heroes j where matrix[j][X] > 0 (they have advantage over X)
    // Heroes X counters = heroes j where matrix[X][j] > 0 (X has advantage over j)

    const TOP_N = 6; // controls how many counters to surface
    const heroCounters: Record<string, unknown> = {};

    for (let i = 0; i < heroNames.length; i++) {
        const heroSlug = dpNameToSlug(heroNames[i]);
        const prevData = existing[heroSlug] || {};

        // Scores for all matchups with hero i
        const scores: { slug: string; advNormal: number; advPro: number; synergy: number }[] = [];

        for (let j = 0; j < heroNames.length; j++) {
            if (i === j) continue;
            const row = matrix[i];
            if (!row || !row[j]) continue;
            const entry = row[j] as [number, number, number];
            scores.push({
                slug: dpNameToSlug(heroNames[j]),
                advNormal: entry[0],   // i's advantage over j
                advPro: entry[1],
                synergy: entry[2],
            });
        }

        // Hero i is "strong against" j when matrix[i][j].advNormal > 0
        const strongAgainst = [...scores]
            .filter(s => s.advNormal > 0)
            .sort((a, b) => b.advNormal - a.advNormal)
            .slice(0, TOP_N)
            .map(s => s.slug);

        // Hero i is "weak against" j when matrix[i][j].advNormal < 0 (j has advantage over i)
        const weakAgainst = [...scores]
            .filter(s => s.advNormal < 0)
            .sort((a, b) => a.advNormal - b.advNormal)
            .slice(0, TOP_N)
            .map(s => s.slug);

        heroCounters[heroSlug] = {
            strongAgainst,
            weakAgainst,
            // Preserve hand-curated counter items and reasons if they exist
            counterItems: prevData.counterItems || [],
            reason: prevData.reason || {
                strongAgainst: '',
                weakAgainst: '',
                itemCounters: '',
            },
        };
    }

    const output = {
        heroCounters,
        // Preserve any hero type counters from old file
        heroTypeCounters: {},
    };

    fs.writeFileSync(countersPath, JSON.stringify(output, null, 2));
    console.log(`\n✨ Generated counters for ${Object.keys(heroCounters).length} heroes → counters.json`);
    console.log('   Run "npm run fetch-heroes" next to merge into heroesList.json');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
