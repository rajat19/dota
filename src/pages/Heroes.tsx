import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { allHeroes } from '../data/heroData'

// ─── Attribute Icons ────────────────────────────────────────────────────────
// Each icon is thematically designed for the attribute it represents.
const AttrIcon = ({ attr, size = 16 }: { attr: string; size?: number }) => {
    if (attr === 'str') return (
        // Heater shield — STR = defense, endurance, fortitude
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            {/* Shield body */}
            <path d="M10 2L3 5.5V11C3 15 6.5 17.8 10 19.5C13.5 17.8 17 15 17 11V5.5L10 2Z"
                fill="#cc2222" />
            {/* Left highlight panel (lighter) */}
            <path d="M10 4.5L5 7V11C5 13.8 7 16 10 18V4.5Z"
                fill="#ff4444" />
            {/* Top bevel highlight */}
            <path d="M10 2.5L3.8 5.8V7.5L10 4.5L16.2 7.5V5.8L10 2.5Z"
                fill="white" opacity="0.2" />
            {/* Rim */}
            <path d="M10 2L3 5.5V11C3 15 6.5 17.8 10 19.5C13.5 17.8 17 15 17 11V5.5L10 2Z"
                fill="none" stroke="rgba(255,160,160,0.5)" strokeWidth="0.6" />
            {/* Center boss circle */}
            <circle cx="10" cy="11" r="2.2" fill="none" stroke="rgba(255,200,200,0.5)" strokeWidth="0.7" />
        </svg>
    )
    if (attr === 'agi') return (
        // Winged bolt — AGI = speed, evasion, precision
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            {/* Main bolt shadow */}
            <path d="M13 2L5.5 11H10.5L7 18.5L16.5 8.5H11.5L13 2Z"
                fill="#228822" />
            {/* Main bolt bright */}
            <path d="M12.5 2L5 11H10L6.5 18.5L16 8.5H11L12.5 2Z"
                fill="#44ff44" />
            {/* Left face (lighter) */}
            <path d="M12.5 2L11 8.5H9.5L5 11H7.5L12.5 2Z"
                fill="white" opacity="0.25" />
            <path d="M12.5 2L5 11H10L6.5 18.5L16 8.5H11L12.5 2Z"
                fill="none" stroke="rgba(180,255,180,0.4)" strokeWidth="0.5" />
            {/* Speed streak left */}
            <line x1="2" y1="9" x2="5.5" y2="9" stroke="#44ff44" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
            <line x1="1.5" y1="11.5" x2="5.5" y2="11" stroke="#44ff44" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
        </svg>
    )
    if (attr === 'int') return (
        // Cut gem / arcane crystal — INT = magic, knowledge, arcane power
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            {/* Crown facets (top) */}
            <polygon points="10,2 14,6.5 10,8 6,6.5" fill="#6aadff" />
            {/* Left body */}
            <polygon points="6,6.5 10,8 10,18 2.5,12.5" fill="#4488ff" />
            {/* Right body */}
            <polygon points="14,6.5 10,8 10,18 17.5,12.5" fill="#1a5ccc" />
            {/* Crown top highlight */}
            <polygon points="10,2 14,6.5 10,8 6,6.5" fill="white" opacity="0.22" />
            {/* Facet lines */}
            <line x1="6" y1="6.5" x2="14" y2="6.5" stroke="rgba(180,210,255,0.7)" strokeWidth="0.7" />
            <line x1="10" y1="2" x2="10" y2="18" stroke="rgba(180,210,255,0.25)" strokeWidth="0.5" />
            <line x1="2.5" y1="12.5" x2="17.5" y2="12.5" stroke="rgba(180,210,255,0.2)" strokeWidth="0.5" />
            {/* Outer rim */}
            <polygon points="10,2 14,6.5 17.5,12.5 10,18 2.5,12.5 6,6.5"
                fill="none" stroke="rgba(150,200,255,0.55)" strokeWidth="0.65" />
            {/* Inner sparkle dot */}
            <circle cx="10" cy="10.5" r="1" fill="white" opacity="0.3" />
        </svg>
    )
    // Atom / globe — UNI = all three stats in harmony
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            {/* Globe base fill */}
            <circle cx="10" cy="10" r="7.5" fill="rgba(255,170,0,0.08)" stroke="#ffaa00" strokeWidth="1.2" />
            {/* Vertical longitude oval */}
            <ellipse cx="10" cy="10" rx="3.5" ry="7.5" stroke="#ffaa00" strokeWidth="0.85" opacity="0.6" />
            {/* Equator */}
            <line x1="2.5" y1="10" x2="17.5" y2="10" stroke="#ffaa00" strokeWidth="0.85" opacity="0.6" />
            {/* Upper tropic curve */}
            <path d="M3.8 6.5 Q10 5.2 16.2 6.5" stroke="#ffaa00" strokeWidth="0.6" opacity="0.4" fill="none" />
            {/* Lower tropic curve */}
            <path d="M3.8 13.5 Q10 14.8 16.2 13.5" stroke="#ffaa00" strokeWidth="0.6" opacity="0.4" fill="none" />
            {/* Top shine arc */}
            <path d="M7 3.5 Q10 2.8 13 3.5" stroke="white" strokeWidth="0.7" opacity="0.25" fill="none" />
            {/* Center pole dot */}
            <circle cx="10" cy="10" r="1.2" fill="#ffaa00" opacity="0.85" />
        </svg>
    )
}

function Heroes() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAttribute, setSelectedAttribute] = useState('any')
    const [selectedRole, setSelectedRole] = useState('All Roles')

    const attributes = [
        { value: 'any', label: 'All' },
        { value: 'str', label: 'STR' },
        { value: 'agi', label: 'AGI' },
        { value: 'int', label: 'INT' },
        { value: 'all', label: 'UNI' },
    ]

    const roles = [
        'All Roles', 'Carry', 'Support', 'Nuker', 'Disabler',
        'Initiator', 'Durable', 'Escape', 'Pusher'
    ]

    const filteredHeroes = useMemo(() => {
        return allHeroes.filter(hero => {
            const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesAttr = selectedAttribute === 'any' || hero.primaryAttr === selectedAttribute
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
                        {attributes.map(attr => (
                            <button
                                key={attr.value + attr.label}
                                className={`filter-btn ${selectedAttribute === attr.value ? 'active' : ''}`}
                                onClick={() => setSelectedAttribute(attr.value)}
                            >
                                {attr.value !== 'any' && <AttrIcon attr={attr.value} size={16} />}
                                {attr.value === 'any' && '⭐'}
                                {' '}{attr.label}
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
                                key={hero.key}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: index * 0.02 }}
                            >
                                <Link to={`/heroes/${hero.key}`} className="hero-card">
                                    <img
                                        src={hero.image}
                                        alt={hero.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/1a1a2e/ffffff?text=${encodeURIComponent(hero.name)}`
                                        }}
                                    />
                                    <div className={`attribute-badge ${hero.primaryAttr}`}>
                                        <AttrIcon attr={hero.primaryAttr} size={14} />
                                    </div>
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
