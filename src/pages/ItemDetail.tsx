import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import itemsData from '../data/items.json'
import { allHeroes } from '../data/heroData'

function ItemDetail() {
  const { itemName } = useParams()
  const navigate = useNavigate()

  // Find item by key (now naturally dashing)
  const item = itemsData.items.find(i => i.key === itemName)

  if (!item) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Item not found</h2>
          <Link to="/items" className="btn btn-primary">Back to Items</Link>
        </div>
      </div>
    )
  }

  // Find heroes this item is good against
  const strongAgainstHeroes = item.countersHeroes
    ?.map((key: string) => allHeroes.find(h => h.key === key))
    .filter(Boolean) || []

  return (
    <div className="item-detail-page">
      <div className="container">
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
        >
          ← Back
        </motion.button>

        <div className="item-detail-layout">
          {/* Header Section */}
          <motion.div
            className="item-header-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="item-main-info">
              <div className="item-image-container">
                <img src={item.image} alt={item.name} />
                <div className="item-cost-badge">
                  <span>💰</span> {item.cost}
                </div>
              </div>
              <div className="item-title-info">
                <span className="item-category-tag">{item.category}</span>
                <h1>{item.name}</h1>
                <p className="item-description">{item.description}</p>
              </div>
            </div>

            <div className="item-stats-section">
              <h3>Attributes & Bonuses</h3>
              <div className="stats-grid">
                {item.attributes.map((attr, idx) => (
                  <div key={idx} className="stat-row">
                    <span className="stat-bullet">⚡</span>
                    <span className="stat-text">{attr}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Counter Info */}
          <div className="item-counter-grid">
            <motion.section
              className="counter-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>Effective Against Hero Types</h2>
              <div className="type-tags">
                {item.countersHeroTypes.length > 0 ? (
                  item.countersHeroTypes.map((type, idx) => (
                    <span key={idx} className="type-tag">{type}</span>
                  ))
                ) : (
                  <p className="empty-text">Generic utility item</p>
                )}
              </div>
            </motion.section>

            <motion.section
              className="counter-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Best Used Against</h2>
              <div className="hero-links-grid">
                {strongAgainstHeroes.length > 0 ? (
                  strongAgainstHeroes.map(hero => (
                    <Link
                      key={hero?.key}
                      to={`/heroes/${hero?.key}`}
                      className="mini-hero-link"
                    >
                      <img src={hero?.image} alt={hero?.name} />
                      <span>{hero?.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="empty-text">No specific hero counters listed</p>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      <style>{`
        .item-detail-page {
          padding-bottom: 60px;
        }

        .back-btn {
          background: transparent;
          color: var(--text-secondary);
          border: none;
          font-size: 1rem;
          margin-bottom: 24px;
          cursor: pointer;
        }

        .item-header-card {
          background: var(--gradient-card);
          border: var(--border-accent);
          border-radius: var(--radius-xl);
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }

        .item-header-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-radiant);
        }

        .item-main-info {
          display: flex;
          gap: 32px;
        }

        .item-image-container {
          position: relative;
          width: 140px;
          height: 105px;
          flex-shrink: 0;
        }

        .item-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .item-cost-badge {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-bg-dark);
          border: 1px solid var(--color-accent-gold);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          color: var(--color-accent-gold);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: var(--shadow-md);
        }

        .item-title-info h1 {
          margin: 8px 0 16px;
          font-size: 2.5rem;
        }

        .item-category-tag {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-accent-blue);
          font-weight: 700;
        }

        .item-description {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.1rem;
        }

        .item-stats-section h3 {
          margin-bottom: 20px;
          color: var(--text-primary);
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--color-accent-green);
        }

        .stat-bullet {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .stat-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .item-counter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .counter-section {
          background: var(--color-bg-card);
          border: var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 32px;
        }

        .counter-section h2 {
          font-size: 1.25rem;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .type-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .type-tag {
          padding: 8px 16px;
          background: rgba(233, 69, 96, 0.15);
          color: var(--color-accent-red);
          border: 1px solid rgba(233, 69, 96, 0.3);
          border-radius: var(--radius-md);
          font-weight: 600;
          text-transform: capitalize;
        }

        .hero-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .mini-hero-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .mini-hero-link:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--color-accent-blue);
          transform: translateY(-4px);
        }

        .mini-hero-link img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .mini-hero-link span {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .empty-text {
          color: var(--text-muted);
          font-style: italic;
        }

        @media (max-width: 900px) {
          .item-header-card {
            grid-template-columns: 1fr;
          }
          .item-counter-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ItemDetail
