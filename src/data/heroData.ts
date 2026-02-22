// Hero data — enriched from OpenDota + Dota2.com APIs via scripts/fetchHeroes.ts
import heroesListData from './heroesList.json'
// Counter data — sourced from dotapicker.com via scripts/fetchCounters.ts
import countersData from './counters.json'

type CounterEntry = {
    strongAgainst?: string[]
    weakAgainst?: string[]
    counterItems?: string[]
    reason?: {
        strongAgainst: string
        weakAgainst: string
        itemCounters: string
    }
}

const counterMap = (countersData as { heroCounters: Record<string, CounterEntry> }).heroCounters

// Merge counter data into each hero at load time.
// This keeps heroesList.json pure (abilities/stats/bio) while
// counters.json can be updated independently via "npm run fetch-counters".
export const allHeroes = heroesListData.heroes.map(hero => {
    const counter = counterMap[hero.key] ?? {}
    return {
        ...hero,
        counters: counter.strongAgainst ?? hero.counters ?? [],
        counteredBy: counter.weakAgainst ?? hero.counteredBy ?? [],
        counterItems: counter.counterItems ?? hero.counterItems ?? [],
        counterReason: counter.reason ?? hero.counterReason ?? null,
    }
})

// Lookups
export const getHeroByKey = (key: string) => allHeroes.find(h => h.key === key)
export const getHeroById = (id: number) => allHeroes.find(h => h.id === id)
export const getHeroesByAttribute = (attr: string) => allHeroes.filter(h => h.primaryAttr === attr)
export const getHeroesByRole = (role: string) => allHeroes.filter(h => h.roles.includes(role))

export default { heroes: allHeroes }
