import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../src/data');

interface HeroData {
    key: string;
    name: string;
    totalPicks: number;
    winrate: number;
}

function run() {
    console.log('📄 Reading heroesList.json to calculate top meta heroes...');

    const heroesListData = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'heroesList.json'), 'utf-8')
    );

    const heroes: HeroData[] = heroesListData.heroes;

    // Filter out heroes with missing stats if any (shouldn't be, but safe)
    const validHeroes = heroes.filter(h => typeof h.totalPicks === 'number');

    // Sort by most picks
    validHeroes.sort((a, b) => b.totalPicks - a.totalPicks);

    // Take top 15 as "Meta"
    const topMeta = validHeroes.slice(0, 15).map(hero => ({
        key: hero.key,
        name: hero.name,
        totalPicks: hero.totalPicks,
        winrate: hero.winrate
    }));

    const output = {
        lastUpdated: new Date().toISOString(),
        topHeroes: topMeta
    };

    fs.writeFileSync(
        path.join(DATA_DIR, 'metaHeroes.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`\n✨ Generated metaHeroes.json with top 15 meta heroes based on overall picks!`);
    if (topMeta.length > 0) {
        console.log(`   #1 Meta Hero: ${topMeta[0].name} (${topMeta[0].totalPicks} picks)`);
        console.log(`   #15 Meta Hero: ${topMeta[14].name} (${topMeta[14].totalPicks} picks)`);
    }
}

try {
    run();
} catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
}
