import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allHeroes } from '../data/heroData'
import itemsData from '../data/items.json'
import countersData from '../data/counters.json'

function HeroDetail() {
  const { heroName } = useParams()
  const navigate = useNavigate()

  const hero = allHeroes.find(h => h.internalName === heroName)
  const counterInfo = hero ? countersData.heroCounters[hero.id] : undefined

  if (!hero) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Hero not found</h2>
          <Link to="/heroes" className="btn btn-primary">Back to Heroes</Link>
        </div>
      </div>
    )
  }

  // Get counter heroes data
  const strongAgainstHeroes = counterInfo?.strongAgainst
    ?.map(id => allHeroes.find(h => h.id === id))
    .filter(Boolean) || []

  const weakAgainstHeroes = counterInfo?.weakAgainst
    ?.map(id => allHeroes.find(h => h.id === id))
    .filter(Boolean) || []

  const counterItems = counterInfo?.counterItems
    ?.map(id => itemsData.items.find(i => i.id === id))
    .filter(Boolean) || []

  const getAttributeColor = (attr) => {
    switch (attr) {
      case 'str': return 'var(--color-str)'
      case 'agi': return 'var(--color-agi)'
      case 'int': return 'var(--color-int)'
      default: return 'var(--color-all)'
    }
  }

  const getAttributeName = (attr) => {
    switch (attr) {
      case 'str': return 'Strength'
      case 'agi': return 'Agility'
      case 'int': return 'Intelligence'
      default: return 'Universal'
    }
  }

  return (
    <div className="hero-detail-page">
      <div className="container">
        {/* Back Button */}
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          ← Back
        </motion.button>

        {/* Hero Header */}
        <motion.div
          className="hero-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="hero-image-container">
            <img
              src={hero.image}
              alt={hero.name}
              className="hero-main-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/256x144/1a1a2e/ffffff?text=${encodeURIComponent(hero.name)}`
              }}
            />
            <div
              className="attribute-indicator"
              style={{ background: getAttributeColor(hero.primaryAttr) }}
            >
              {getAttributeName(hero.primaryAttr)}
            </div>
          </div>

          <div className="hero-main-info">
            <h1>{hero.name}</h1>

            <div className="hero-meta">
              <span className="attack-type">
                {hero.attackType === 'Melee' ? '⚔️' : '🏹'} {hero.attackType}
              </span>
            </div>

            <div className="hero-roles">
              {hero.roles.map(role => (
                <span key={role} className="role-badge">{role}</span>
              ))}
            </div>

            {/* Base Stats */}
            <div className="base-stats">
              <div className="stat-group">
                <div className="stat" style={{ color: 'var(--color-str)' }}>
                  <span className="stat-icon">💪</span>
                  <span className="stat-value">{hero.baseStr}</span>
                  <span className="stat-gain">+{hero.strGain}</span>
                </div>
                <div className="stat" style={{ color: 'var(--color-agi)' }}>
                  <span className="stat-icon">🎯</span>
                  <span className="stat-value">{hero.baseAgi}</span>
                  <span className="stat-gain">+{hero.agiGain}</span>
                </div>
                <div className="stat" style={{ color: 'var(--color-int)' }}>
                  <span className="stat-icon">🧠</span>
                  <span className="stat-value">{hero.baseInt}</span>
                  <span className="stat-gain">+{hero.intGain}</span>
                </div>
              </div>

              <div className="secondary-stats">
                <div className="sec-stat">
                  <span className="label">HP</span>
                  <span className="value">{hero.baseHealth + hero.baseStr * 22}</span>
                </div>
                <div className="sec-stat">
                  <span className="label">Mana</span>
                  <span className="value">{hero.baseMana + hero.baseInt * 12}</span>
                </div>
                <div className="sec-stat">
                  <span className="label">Armor</span>
                  <span className="value">{(hero.baseArmor + hero.baseAgi * 0.167).toFixed(1)}</span>
                </div>
                <div className="sec-stat">
                  <span className="label">Speed</span>
                  <span className="value">{hero.baseMoveSpeed}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Abilities Section */}
        <motion.section
          className="abilities-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>⚡ Abilities</h2>
          <div className="abilities-grid">
            {hero.abilities.map((ability, index) => (
              <motion.div
                key={ability.name}
                className="ability-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="ability-header">
                  <h4>{ability.name}</h4>
                  <span className={`ability-type ${ability.type}`}>
                    {ability.type}
                  </span>
                </div>
                <p>{ability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Counter Information */}
        <div className="counter-sections">
          {/* Strong Against */}
          {strongAgainstHeroes.length > 0 && (
            <motion.section
              className="counter-section strong-against"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>💪 Strong Against</h2>
              {counterInfo?.reason?.strongAgainst && (
                <p className="counter-reason">{counterInfo.reason.strongAgainst}</p>
              )}
              <div className="counter-heroes-grid">
                {strongAgainstHeroes.map(h => (
                  <Link
                    key={h.id}
                    to={`/heroes/${h.internalName}`}
                    className="mini-hero-card"
                  >
                    <img src={h.image} alt={h.name} />
                    <span>{h.name}</span>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Weak Against */}
          {weakAgainstHeroes.length > 0 && (
            <motion.section
              className="counter-section weak-against"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2>💀 Weak Against</h2>
              {counterInfo?.reason?.weakAgainst && (
                <p className="counter-reason">{counterInfo.reason.weakAgainst}</p>
              )}
              <div className="counter-heroes-grid">
                {weakAgainstHeroes.map(h => (
                  <Link
                    key={h.id}
                    to={`/heroes/${h.internalName}`}
                    className="mini-hero-card"
                  >
                    <img src={h.image} alt={h.name} />
                    <span>{h.name}</span>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Counter Items */}
          {counterItems.length > 0 && (
            <motion.section
              className="counter-section counter-items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2>🎒 Items to Counter</h2>
              {counterInfo?.reason?.itemCounters && (
                <p className="counter-reason">{counterInfo.reason.itemCounters}</p>
              )}
              <div className="counter-items-grid">
                {counterItems.map(item => (
                  <div key={item.id} className="mini-item-card">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-cost">💰 {item.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* CTA */}
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/counter-picker" className="btn btn-primary">
            🎯 Find Counters for {hero.name}
          </Link>
        </motion.div>
      </div>

      <style>{`
        .hero-detail-page {
          min-height: 100vh;
          padding-bottom: 60px;
        }

        .back-btn {
          background: transparent;
          border: var(--border-subtle);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          transition: var(--transition-fast);
        }

        .back-btn:hover {
          background: var(--color-bg-card);
          color: var(--text-primary);
        }

        .hero-header {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          margin-bottom: 48px;
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 32px;
        }

        @media (max-width: 768px) {
          .hero-header {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .hero-image-container {
          position: relative;
        }

        .hero-main-image {
          width: 100%;
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-accent-gold);
          box-shadow: var(--shadow-glow-gold);
        }

        .attribute-indicator {
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 16px;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-bg-dark);
        }

        .hero-main-info h1 {
          margin-bottom: 12px;
          font-size: 2.5rem;
        }

        .hero-meta {
          margin-bottom: 16px;
        }

        .attack-type {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .hero-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .hero-roles {
            justify-content: center;
          }
        }

        .role-badge {
          padding: 6px 12px;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .base-stats {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          padding: 20px;
        }

        .stat-group {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .stat-group {
            justify-content: center;
          }
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-icon {
          font-size: 1.25rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .stat-gain {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .secondary-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .secondary-stats {
            justify-content: center;
          }
        }

        .sec-stat {
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
        }

        .sec-stat .label {
          color: var(--text-muted);
        }

        .sec-stat .value {
          font-weight: 600;
        }

        .abilities-section {
          margin-bottom: 48px;
        }

        .abilities-section h2 {
          margin-bottom: 24px;
        }

        .abilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .ability-card {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: var(--transition-normal);
        }

        .ability-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateY(-2px);
        }

        .ability-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .ability-header h4 {
          color: var(--color-accent-gold);
          font-family: var(--font-body);
          font-size: 1rem;
        }

        .ability-type {
          font-size: 0.65rem;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          background: var(--color-bg-tertiary);
          color: var(--text-muted);
        }

        .ability-type.ultimate {
          background: var(--color-accent-purple);
          color: white;
        }

        .ability-type.passive {
          background: var(--color-accent-green);
          color: var(--color-bg-dark);
        }

        .ability-card p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .counter-sections {
          display: grid;
          gap: 32px;
          margin-bottom: 48px;
        }

        .counter-section {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .counter-section h2 {
          margin-bottom: 12px;
          font-size: 1.25rem;
        }

        .counter-reason {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 20px;
          padding-left: 16px;
          border-left: 3px solid var(--color-accent-blue);
        }

        .strong-against {
          border-left: 4px solid var(--color-accent-green);
        }

        .weak-against {
          border-left: 4px solid var(--color-accent-red);
        }

        .counter-items {
          border-left: 4px solid var(--color-accent-gold);
        }

        .counter-heroes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mini-hero-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }

        .mini-hero-card:hover {
          border-color: var(--color-accent-blue);
          transform: translateY(-2px);
        }

        .mini-hero-card img {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .mini-hero-card span {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .counter-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .mini-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--color-bg-secondary);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .mini-item-card img {
          width: 48px;
          height: 36px;
          object-fit: contain;
        }

        .mini-item-card .item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mini-item-card .item-name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .mini-item-card .item-cost {
          font-size: 0.75rem;
          color: var(--color-accent-gold);
        }

        .hero-cta {
          text-align: center;
          padding: 40px;
          background: var(--gradient-card);
          border: var(--border-accent);
          border-radius: var(--radius-xl);
        }

        .not-found {
          text-align: center;
          padding: 80px 20px;
        }

        .not-found h2 {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  )
}

export default HeroDetail
