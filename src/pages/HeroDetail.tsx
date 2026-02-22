import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allHeroes } from '../data/heroData'
import itemsData from '../data/items.json'
import { getHeroRenderPng, getAttributeIcon, getAbilityIcon, getFacetIcon } from '../utils/steamAssets'

function HeroDetail() {
  const { heroName } = useParams()
  const navigate = useNavigate()

  const hero = allHeroes.find(h => h.key === heroName)

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

  // Get counter heroes data (now stored directly on the hero)
  const strongAgainstHeroes = hero.counters
    ?.map((key: string) => allHeroes.find(h => h.key === key))
    .filter(Boolean) || []

  const weakAgainstHeroes = hero.counteredBy
    ?.map((key: string) => allHeroes.find(h => h.key === key))
    .filter(Boolean) || []

  const counterItems = hero.counterItems
    ?.map((key: string) => itemsData.items.find(i => i.key === key))
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
              src={getHeroRenderPng(hero.key)}
              alt={hero.name}
              className="hero-main-image"
              onError={(e) => {
                // Fallback to existing small image if CDN fails
                (e.target as HTMLImageElement).src = hero.image
              }}
            />
            <div className="attribute-indicator" style={{ background: getAttributeColor(hero.primaryAttr) }}>
              <img
                src={getAttributeIcon(hero.primaryAttr)}
                alt={getAttributeName(hero.primaryAttr)}
                className="attribute-icon"
              />
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

        {/* Hero Bio */}
        {hero.hype && (
          <motion.section
            className="hero-bio-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="hero-hype">{hero.hype}</p>
          </motion.section>
        )}

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
                className={`ability-card ${ability.type === 'ultimate' ? 'ultimate' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="ability-header">
                  <div className="ability-title-row">
                    <img
                      src={getAbilityIcon(ability.internalName)}
                      alt={ability.name}
                      className="ability-icon"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <h4>{ability.name}</h4>
                  </div>
                  <span className={`ability-type ${ability.type}`}>
                    {ability.type}
                    {ability.isPassive && ' / passive'}
                  </span>
                </div>
                <p>{ability.description}</p>
                {ability.lore && <p className="ability-lore">"{ability.lore}"</p>}

                {/* Cooldown & Mana */}
                <div className="ability-stats">
                  {ability.cooldown?.length > 0 && (
                    <span className="ability-stat cooldown">🕐 {ability.cooldown.join(' / ')}</span>
                  )}
                  {ability.manaCost?.length > 0 && (
                    <span className="ability-stat mana">💧 {ability.manaCost.join(' / ')}</span>
                  )}
                </div>

                {/* Scepter / Shard */}
                {ability.hasScepter && ability.scepterDesc && (
                  <div className="upgrade-tag scepter">
                    <span className="upgrade-icon">🔷</span>
                    <span>Aghanim's Scepter: {ability.scepterDesc.replace(/%[^%]+%/g, '').replace(/%%/g, '%')}</span>
                  </div>
                )}
                {ability.hasShard && ability.shardDesc && (
                  <div className="upgrade-tag shard">
                    <span className="upgrade-icon">🔶</span>
                    <span>Aghanim's Shard: {ability.shardDesc.replace(/%[^%]+%/g, '').replace(/%%/g, '%')}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Talents */}
        {hero.talents?.length > 0 && (
          <motion.section
            className="talents-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2>🌟 Talents</h2>
            <div className="talent-tree">
              {[...hero.talents].reverse().map((tier) => (
                <div key={tier.level} className="talent-row">
                  <span className="talent-choice left">{tier.left}</span>
                  <span className="talent-level">{tier.level}</span>
                  <span className="talent-choice right">{tier.right}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Facets */}
        {hero.facets?.length > 0 && (
          <motion.section
            className="facets-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>💎 Facets</h2>
            <div className="facets-grid">
              {hero.facets.map((facet) => (
                <div key={facet.name} className="facet-card">
                  <div className="facet-header">
                    <img
                      src={getFacetIcon(facet.icon)}
                      alt={facet.name}
                      className="facet-icon"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <h4>{facet.name}</h4>
                  </div>
                  <p>{facet.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

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
              {hero.counterReason?.strongAgainst && (
                <p className="counter-reason">{hero.counterReason.strongAgainst}</p>
              )}
              <div className="counter-heroes-grid">
                {strongAgainstHeroes.map(h => (
                  <Link
                    key={h.key}
                    to={`/heroes/${h.key}`}
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
              {hero.counterReason?.weakAgainst && (
                <p className="counter-reason">{hero.counterReason.weakAgainst}</p>
              )}
              <div className="counter-heroes-grid">
                {weakAgainstHeroes.map(h => (
                  <Link
                    key={h.key}
                    to={`/heroes/${h.key}`}
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
              {hero.counterReason?.itemCounters && (
                <p className="counter-reason">{hero.counterReason.itemCounters}</p>
              )}
              <div className="counter-items-grid">
                {counterItems.map(item => (
                  <Link
                    key={item.key}
                    to={`/items/${item.key}`}
                    className="mini-item-card"
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-cost">💰 {item.cost}</span>
                    </div>
                  </Link>
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
          align-items: center;
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
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          width: max-content;
        }

        .attribute-icon {
          width: 24px;
          height: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
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
          margin-bottom: 16px;
        }

        .ability-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ability-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .ability-header h4 {
          color: var(--color-accent-gold);
          font-family: var(--font-body);
          font-size: 1.1rem;
          margin: 0;
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
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        
        .ability-lore {
          font-style: italic;
          color: var(--text-muted) !important;
          font-size: 0.8rem !important;
          border-left: 2px solid rgba(255,255,255,0.1);
          padding-left: 12px;
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

        /* Hero Bio */
        .hero-bio-section {
          margin-bottom: 32px;
        }

        .hero-hype {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          font-style: italic;
          padding: 20px 24px;
          background: var(--gradient-card);
          border-left: 3px solid var(--color-accent-gold);
          border-radius: var(--radius-md);
        }

        /* Ability Stats */
        .ability-stats {
          display: flex;
          gap: 16px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .ability-stat {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .ability-stat.cooldown { color: #8ec8e8; }
        .ability-stat.mana { color: #6b9bff; }

        .ability-card.ultimate {
          border-left: 3px solid var(--color-accent-gold);
        }

        /* Scepter / Shard tags */
        .upgrade-tag {
          margin-top: 8px;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          line-height: 1.5;
          color: var(--text-secondary);
          display: flex;
          gap: 6px;
          align-items: flex-start;
        }

        .upgrade-tag.scepter {
          background: rgba(30, 90, 180, 0.15);
          border: 1px solid rgba(30, 90, 180, 0.3);
        }

        .upgrade-tag.shard {
          background: rgba(180, 120, 30, 0.15);
          border: 1px solid rgba(180, 120, 30, 0.3);
        }

        .upgrade-icon { flex-shrink: 0; }

        /* Talent Tree */
        .talents-section {
          margin-bottom: 32px;
        }

        .talents-section h2 {
          margin-bottom: 16px;
        }

        .talent-tree {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .talent-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 12px;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .talent-row:last-child { border-bottom: none; }

        .talent-choice {
          font-size: 0.82rem;
          color: var(--text-secondary);
          padding: 8px 14px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .talent-choice.left { text-align: right; }
        .talent-choice.right { text-align: left; }

        .talent-level {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-gold);
          color: #000;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: var(--radius-round);
          flex-shrink: 0;
        }

        /* Facets */
        .facets-section {
          margin-bottom: 32px;
        }

        .facets-section h2 {
          margin-bottom: 16px;
        }

        .facets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .facet-card {
          padding: 16px;
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--color-accent-purple);
        }

        .facet-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .facet-icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .facet-card h4 {
          color: var(--color-accent-purple);
          font-family: var(--font-body);
          font-size: 0.95rem;
          margin: 0;
        }

        .facet-card p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.6;
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
