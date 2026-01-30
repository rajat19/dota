import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { allHeroes } from '../data/heroData'

function Heroes() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAttribute, setSelectedAttribute] = useState('all')
    const [selectedRole, setSelectedRole] = useState('All Roles')

    const attributes = [
        { value: 'all', label: 'All Attributes', icon: '⭐' },
        { value: 'str', label: 'Strength', icon: '💪' },
        { value: 'agi', label: 'Agility', icon: '🎯' },
        { value: 'int', label: 'Intelligence', icon: '🧠' },
        { value: 'all', label: 'Universal', icon: '🌟' }
    ]

    const roles = [
        'All Roles', 'Carry', 'Support', 'Nuker', 'Disabler',
        'Initiator', 'Durable', 'Escape', 'Pusher'
    ]

    const filteredHeroes = useMemo(() => {
        return allHeroes.filter(hero => {
            const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesAttr = selectedAttribute === 'all' || hero.primaryAttr === selectedAttribute
            const matchesRole = selectedRole === 'All Roles' || hero.roles.includes(selectedRole)
            return matchesSearch && matchesAttr && matchesRole
        })
    }, [searchQuery, selectedAttribute, selectedRole])

    const heroCount = filteredHeroes.length

    return (
        <div className="heroes-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Dota 2 Heroes</h1>
                    <p>Explore all {allHeroes.length} heroes with their abilities and attributes</p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    className="filter-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search heroes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="filter-buttons">
                        {['all', 'str', 'agi', 'int'].map(attr => (
                            <button
                                key={attr}
                                className={`filter-btn ${selectedAttribute === attr ? 'active' : ''}`}
                                onClick={() => setSelectedAttribute(attr)}
                            >
                                {attr === 'all' ? '⭐ All' :
                                    attr === 'str' ? '💪 STR' :
                                        attr === 'agi' ? '🎯 AGI' : '🧠 INT'}
                            </button>
                        ))}
                    </div>

                    <select
                        className="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    className="results-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="count">{heroCount}</span> heroes found
                </motion.div>

                {/* Hero Grid */}
                <div className="hero-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredHeroes.map((hero, index) => (
                            <motion.div
                                key={hero.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: index * 0.02 }}
                            >
                                <Link to={`/heroes/${hero.id}`} className="hero-card">
                                    <img
                                        src={hero.image}
                                        alt={hero.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = `https://via.placeholder.com/200x200/1a1a2e/ffffff?text=${encodeURIComponent(hero.name)}`
                                        }}
                                    />
                                    <span className={`attribute-badge ${hero.primaryAttr}`}>
                                        {hero.primaryAttr === 'str' ? '💪' :
                                            hero.primaryAttr === 'agi' ? '🎯' :
                                                hero.primaryAttr === 'int' ? '🧠' : '🌟'}
                                    </span>
                                    <span className="hero-name">{hero.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredHeroes.length === 0 && (
                    <motion.div
                        className="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="icon">🔍</span>
                        <h3>No heroes found</h3>
                        <p>Try adjusting your filters or search query</p>
                    </motion.div>
                )}
            </div>

            <style>{`
        .heroes-page {
          min-height: 100vh;
        }

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
          align-items: center;
        }

        .role-select {
          padding: 12px 16px;
          background: var(--color-bg-card);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          min-width: 150px;
        }

        .role-select:focus {
          border-color: var(--color-accent-blue);
          outline: none;
        }

        .results-info {
          margin-bottom: 24px;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .results-info .count {
          color: var(--color-accent-gold);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .no-results {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-secondary);
        }

        .no-results .icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 16px;
        }

        .no-results h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-buttons {
            justify-content: center;
          }

          .role-select {
            width: 100%;
          }
        }
      `}</style>
        </div>
    )
}

export default Heroes
