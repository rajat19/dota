import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AttrIcon from '../components/AttrIcon'
import { allHeroes } from '../data/heroData'
import metaHeroesData from '../data/metaHeroes.json'

function Home() {
  // Map meta hero slugs back to full hero objects and combine with meta stats
  const featuredHeroes = metaHeroesData.topHeroes
    .map(meta => {
      const hero = allHeroes.find(h => h.key === meta.key)
      if (!hero) return null
      return { ...hero, metaStats: meta }
    })
    .filter((h): h is NonNullable<typeof h> => h !== null)
    .slice(0, 15)

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">
              Master the Art of<br />Counter Picking
            </h1>
            <p className="hero-subtitle">
              Analyze enemy heroes and discover the perfect counters.
              Get strategic item recommendations and dominate your matches.
            </p>
            <div className="hero-buttons">
              <Link to="/counter-picker" className="btn btn-primary">
                🎯 Start Counter Picking
              </Link>
              <Link to="/heroes" className="btn btn-secondary">
                📚 Browse Heroes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Powerful Features</h2>
            <p>Everything you need to dominate the battlefield</p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="feature-icon">🦸</div>
              <h3>Hero Database</h3>
              <p>Complete information on all Dota 2 heroes including abilities, attributes, and playstyles.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-icon">⚔️</div>
              <h3>Counter Picking</h3>
              <p>Select enemy heroes and get instant recommendations for the best counter picks.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="feature-icon">🎒</div>
              <h3>Item Counters</h3>
              <p>Discover which items are most effective against specific hero compositions.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="feature-icon">📊</div>
              <h3>Strategic Insights</h3>
              <p>Understand why certain heroes and items counter others with detailed explanations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Heroes */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <h2>Current Meta Heroes</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Most played heroes in Divine/Immortal & Pro brackets</p>
            </div>
            <Link to="/heroes" className="view-all-link">View All Heroes →</Link>
          </motion.div>

          <div className="hero-grid">
            {featuredHeroes.map((hero, index) => (
              <motion.div
                key={hero.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Link to={`/heroes/${hero.key}`} className="meta-card-container">
                  <div className="meta-image-box">
                    <div className="meta-rank">#{index + 1}</div>
                    <img
                      src={hero.image}
                      alt={hero.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/1a1a2e/ffffff?text=${hero.name}`
                      }}
                    />
                    <span className={`attribute-badge ${hero.primaryAttr}`}>
                      <AttrIcon attr={hero.primaryAttr} size={14} />
                    </span>
                    <span className="hero-name">{hero.name}</span>
                  </div>
                  <div className="meta-stats-panel">
                    <div className="meta-stat">
                      <span className="meta-label">Win Rate</span>
                      <span className={`meta-value ${hero.metaStats.winrate >= 50 ? 'positive' : 'negative'}`}>
                        {hero.metaStats.winrate}%
                      </span>
                    </div>
                    <div className="meta-stat">
                      <span className="meta-label">Total Picks</span>
                      <span className="meta-value">{(hero.metaStats.totalPicks / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h2>Ready to Win More Games?</h2>
            <p>Start using our counter picking tool and climb the MMR ladder!</p>
            <Link to="/counter-picker" className="btn btn-primary">
              Try Counter Picker Now
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        .home-page {
          overflow: hidden;
        }

        .hero-section {
          padding: 80px 0 100px;
          position: relative;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 500px;
          background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .features-section {
          padding: 80px 0;
          background: rgba(22, 33, 62, 0.3);
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          margin-bottom: 8px;
        }

        .section-header p {
          color: var(--text-secondary);
        }

        .view-all-link {
          color: var(--color-accent-gold);
          font-weight: 600;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 32px;
          text-align: center;
          transition: var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: var(--shadow-glow);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .feature-card h3 {
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .featured-section {
          padding: 80px 0;
        }

        .featured-section .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .meta-card-container {
          display: flex;
          flex-direction: column;
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--transition-normal);
          border: 1px solid rgba(255, 255, 255, 0.05);
          text-decoration: none;
        }
        .meta-card-container:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
          border-color: var(--color-accent-blue);
        }
        .meta-image-box {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }
        .meta-image-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
          z-index: 1;
        }
        .meta-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          transition: var(--transition-normal);
        }
        .meta-card-container:hover .meta-image-box img {
          transform: scale(1.1);
        }
        .meta-rank {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          color: white;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 10;
        }
        .meta-image-box .hero-name {
          position: absolute;
          bottom: var(--spacing-sm);
          left: var(--spacing-sm);
          right: var(--spacing-sm);
          z-index: 2;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        .meta-image-box .attribute-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          width: 26px;
          height: 26px;
          border-radius: var(--radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }
        .meta-stats-panel {
          display: flex;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .meta-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-stat:last-child {
          text-align: right;
        }

        .meta-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
        }

        .meta-value.positive {
          color: var(--color-accent-green);
        }

        .meta-value.negative {
          color: var(--color-accent-red);
        }

        .cta-section {
          padding: 80px 0;
          background: linear-gradient(180deg, transparent 0%, rgba(233, 69, 96, 0.1) 100%);
        }

        .cta-content {
          text-align: center;
          background: var(--gradient-card);
          border: var(--border-accent);
          border-radius: var(--radius-xl);
          padding: 60px 40px;
          position: relative;
          overflow: hidden;
        }

        .cta-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-radiant);
        }

        .cta-content h2 {
          margin-bottom: 12px;
        }

        .cta-content p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 0 60px;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .featured-section .section-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .cta-content {
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  )
}

export default Home
