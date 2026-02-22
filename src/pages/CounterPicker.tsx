import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { allHeroes } from '../data/heroData'
import itemsData from '../data/items.json'

function CounterPicker() {
  const [selectedHeroes, setSelectedHeroes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const maxHeroes = 5

  // Filter heroes for selection
  const filteredHeroes = useMemo(() => {
    return allHeroes.filter(hero => {
      const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
      const notSelected = !selectedHeroes.find(h => h.key === hero.key)
      return matchesSearch && notSelected
    })
  }, [searchQuery, selectedHeroes])

  // Add a hero to selection
  const addHero = useCallback((hero) => {
    if (selectedHeroes.length < maxHeroes) {
      setSelectedHeroes(prev => [...prev, hero])
    }
  }, [selectedHeroes.length])

  // Remove a hero from selection
  const removeHero = useCallback((heroId) => {
    setSelectedHeroes(prev => prev.filter(h => h.key !== heroId))
  }, [])

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedHeroes([])
    setShowResults(false)
  }, [])

  // Calculate counter recommendations
  const counterRecommendations = useMemo(() => {
    if (selectedHeroes.length === 0) return { heroes: [], items: [] }

    interface CounterScore {
      key: string;
      score: number;
      reasons: string[];
    }

    // Collect all counter heroes — always keyed by slug
    const heroCounterScores: Record<string, CounterScore> = {}
    const itemCounterScores: Record<string, { key: string; score: number; reasons: string[] }> = {}

    selectedHeroes.forEach(selectedHero => {
      // Hero counters from enriched data (counteredBy = heroes weak against this pick)
      if (selectedHero.counteredBy) {
        selectedHero.counteredBy.forEach((counterHeroKey: string, index: number) => {
          if (!heroCounterScores[counterHeroKey]) {
            heroCounterScores[counterHeroKey] = { key: counterHeroKey, score: 0, reasons: [] }
          }
          heroCounterScores[counterHeroKey].score += (5 - index) * 2
          heroCounterScores[counterHeroKey].reasons.push(`Counters ${selectedHero.name}`)
        })
      }

      // Item counters from enriched data
      if (selectedHero.counterItems) {
        selectedHero.counterItems.forEach((itemKey: string, index: number) => {
          if (!itemCounterScores[itemKey]) {
            itemCounterScores[itemKey] = { key: itemKey, score: 0, reasons: [] }
          }
          itemCounterScores[itemKey].score += (5 - index) * 2
          itemCounterScores[itemKey].reasons.push(`Effective vs ${selectedHero.name}`)
        })
      }
    })

    // Sort and get top counters
    const sortedHeroCounters = Object.values(heroCounterScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(counter => {
        const hero = allHeroes.find(h => h.key === counter.key)
        return hero ? { ...hero, counterScore: counter.score, reasons: counter.reasons } : null
      })
      .filter(Boolean)

    const sortedItemCounters = Object.values(itemCounterScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(counter => {
        const item = itemsData.items.find(i => i.key === counter.key)
        return item ? { ...item, counterScore: counter.score, reasons: counter.reasons } : null
      })
      .filter(Boolean)

    return {
      heroes: sortedHeroCounters,
      items: sortedItemCounters
    }
  }, [selectedHeroes])

  // Find heroes the team is weak against
  const teamWeaknesses = useMemo(() => {
    if (selectedHeroes.length === 0) return []

    interface WeaknessScore {
      id: number | string;
      score: number;
    }
    const weaknessScores: Record<number | string, WeaknessScore> = {}

    selectedHeroes.forEach(hero => {
      hero.counters?.forEach((counteredHeroKey: string, index: number) => {
        if (!weaknessScores[counteredHeroKey]) {
          weaknessScores[counteredHeroKey] = { id: counteredHeroKey, score: 0 }
        }
        weaknessScores[counteredHeroKey].score += (5 - index)
      })
    })

    return Object.values(weaknessScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(w => allHeroes.find(h => h.key === w.id))
      .filter(Boolean)
  }, [selectedHeroes])

  return (
    <div className="counter-picker-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🎯 Counter Picker</h1>
          <p>Select enemy heroes to find the best counter picks and item recommendations</p>
        </motion.div>

        <div className="counter-picker-layout">
          {/* Left Panel - Hero Selection */}
          <motion.div
            className="selection-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="panel-header">
              <h2>👹 Enemy Team</h2>
              <button
                className="btn-clear"
                onClick={clearAll}
                disabled={selectedHeroes.length === 0}
              >
                Clear All
              </button>
            </div>

            {/* Selected Heroes Slots */}
            <div className="selected-heroes-grid">
              {Array.from({ length: maxHeroes }).map((_, index) => {
                const hero = selectedHeroes[index]
                return (
                  <motion.div
                    key={index}
                    className={`hero-slot ${hero ? 'filled' : ''}`}
                    layout
                  >
                    {hero ? (
                      <>
                        <img src={hero.image} alt={hero.name} />
                        <span className="hero-slot-name">{hero.name}</span>
                        <button
                          className="remove-hero-btn"
                          onClick={() => removeHero(hero.key)}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="slot-empty">
                        <span className="slot-number">{index + 1}</span>
                        <span className="slot-text">Select Hero</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Hero Search & Grid */}
            <div className="hero-search-section">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search heroes to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="available-heroes-grid">
                <AnimatePresence>
                  {filteredHeroes.slice(0, 20).map((hero) => (
                    <motion.button
                      key={hero.key}
                      className="available-hero"
                      onClick={() => addHero(hero)}
                      disabled={selectedHeroes.length >= maxHeroes}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={hero.image} alt={hero.name} />
                      <span className="hero-label">{hero.name}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button
              className="btn btn-primary analyze-btn"
              onClick={() => setShowResults(true)}
              disabled={selectedHeroes.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ⚔️ Find Counters ({selectedHeroes.length}/{maxHeroes})
            </motion.button>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            className="results-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {selectedHeroes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎯</span>
                <h3>Select Enemy Heroes</h3>
                <p>Choose up to 5 enemy heroes from the left panel to see counter recommendations</p>
              </div>
            ) : (
              <>
                {/* Counter Heroes Section */}
                <div className="results-section">
                  <h3>
                    <span className="section-icon">⚔️</span>
                    Best Counter Heroes
                  </h3>
                  <div className="counter-heroes-list">
                    <AnimatePresence>
                      {counterRecommendations.heroes.map((hero, index) => (
                        <motion.div
                          key={hero.key}
                          className="counter-hero-card"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="rank-badge">#{index + 1}</div>
                          <img src={hero.image} alt={hero.name} />
                          <div className="counter-hero-info">
                            <span className="counter-name">{hero.name}</span>
                            <span className="counter-roles">
                              {hero.roles.slice(0, 2).join(', ')}
                            </span>
                          </div>
                          <div className="counter-score">
                            <span className="score-value">+{hero.counterScore}</span>
                            <span className="score-label">Score</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Counter Items Section */}
                <div className="results-section">
                  <h3>
                    <span className="section-icon">🎒</span>
                    Recommended Items
                  </h3>
                  <div className="counter-items-list">
                    <AnimatePresence>
                      {counterRecommendations.items.map((item, index) => (
                        <motion.div
                          key={item.key}
                          className="counter-item-card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-cost">💰 {item.cost}</span>
                          </div>
                          <div className="item-reason">
                            {item.reasons.slice(0, 1).map((reason, i) => (
                              <span key={i}>{reason}</span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Team is Strong Against Section */}
                {teamWeaknesses.length > 0 && (
                  <div className="results-section weakness-section">
                    <h3>
                      <span className="section-icon">💀</span>
                      Enemy Team is Weak Against
                    </h3>
                    <div className="weakness-list">
                      {teamWeaknesses.map((hero) => (
                        <div key={hero.key} className="weakness-hero">
                          <img src={hero.image} alt={hero.name} />
                          <span>{hero.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .counter-picker-page {
          min-height: 100vh;
        }

        .counter-picker-layout {
          display: grid;
          grid-template-columns: 1fr 450px;
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .counter-picker-layout {
            grid-template-columns: 1fr;
          }
        }

        .selection-panel,
        .results-panel {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 24px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .panel-header h2 {
          font-size: 1.25rem;
        }

        .btn-clear {
          padding: 8px 16px;
          background: transparent;
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.8rem;
          transition: var(--transition-fast);
        }

        .btn-clear:hover:not(:disabled) {
          background: var(--color-accent-red);
          border-color: var(--color-accent-red);
          color: white;
        }

        .btn-clear:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .selected-heroes-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .hero-slot {
          aspect-ratio: 3/4;
          background: var(--color-bg-secondary);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
          transition: var(--transition-normal);
        }

        .hero-slot.filled {
          border-style: solid;
          border-color: var(--color-accent-gold);
        }

        .hero-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-slot-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.9));
          padding: 16px 4px 4px;
          font-size: 0.65rem;
          text-align: center;
          color: white;
        }

        .remove-hero-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: var(--color-accent-red);
          border: none;
          border-radius: var(--radius-round);
          color: white;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-fast);
        }

        .hero-slot:hover .remove-hero-btn {
          opacity: 1;
        }

        .slot-empty {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .slot-number {
          font-size: 1.5rem;
          font-weight: 700;
          opacity: 0.3;
        }

        .slot-text {
          font-size: 0.6rem;
          text-transform: uppercase;
        }

        .hero-search-section {
          margin-bottom: 24px;
        }

        .hero-search-section .search-input {
          width: 100%;
          margin-bottom: 16px;
        }

        .available-heroes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
          padding: 4px;
        }

        .available-hero {
          aspect-ratio: 1;
          background: var(--color-bg-secondary);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .available-hero:hover:not(:disabled) {
          border-color: var(--color-accent-blue);
          box-shadow: var(--shadow-glow);
        }

        .available-hero:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .available-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .available-hero .hero-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.9));
          padding: 12px 2px 2px;
          font-size: 0.55rem;
          color: white;
        }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Results Panel */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .results-section {
          margin-bottom: 32px;
        }

        .results-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .section-icon {
          font-size: 1.25rem;
        }

        .counter-heroes-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .counter-hero-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-bg-secondary);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
          transition: var(--transition-normal);
        }

        .counter-hero-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateX(4px);
        }

        .rank-badge {
          width: 28px;
          height: 28px;
          background: var(--gradient-radiant);
          border-radius: var(--radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-bg-dark);
        }

        .counter-hero-card img {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .counter-hero-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .counter-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .counter-roles {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .counter-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          background: rgba(0, 255, 136, 0.1);
          border-radius: var(--radius-sm);
        }

        .score-value {
          color: var(--color-accent-green);
          font-weight: 700;
          font-size: 1rem;
        }

        .score-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .counter-items-list {
          display: grid;
          gap: 8px;
        }

        .counter-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-bg-secondary);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
          transition: var(--transition-normal);
        }

        .counter-item-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
        }

        .counter-item-card img {
          width: 48px;
          height: 36px;
          object-fit: contain;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-details .item-name {
          font-weight: 600;
          font-size: 0.85rem;
        }

        .item-details .item-cost {
          font-size: 0.75rem;
          color: var(--color-accent-gold);
        }

        .item-reason {
          font-size: 0.7rem;
          color: var(--text-muted);
          max-width: 120px;
          text-align: right;
        }

        .weakness-section {
          background: rgba(233, 69, 96, 0.1);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-top: 24px;
        }

        .weakness-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .weakness-hero {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
        }

        .weakness-hero img {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .selected-heroes-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
          }

          .available-heroes-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

export default CounterPicker
