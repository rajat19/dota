import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import itemsData from '../data/items.json'

function Items() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredItem, setHoveredItem] = useState(null)

  const categories = [
    { value: 'all', label: 'All Items', icon: '📦' },
    ...Object.entries(itemsData.categories).map(([key, cat]) => ({
      value: key,
      label: cat.name,
      icon: cat.icon
    }))
  ]

  const filteredItems = useMemo(() => {
    return itemsData.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const itemCount = filteredItems.length

  return (
    <div className="items-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Dota 2 Items</h1>
          <p>Browse all items with their stats and counter abilities</p>
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
            placeholder="🔍 Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`category-tab ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span className="tab-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="results-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="count">{itemCount}</span> items found
        </motion.div>

        {/* Items Grid */}
        <div className="items-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const itemSlug = item.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
              return (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="item-wrapper"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link to={`/items/${itemSlug}`} className="item-card-link">
                    <div className="item-card-large">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/88x64/1a1a2e/ffffff?text=${encodeURIComponent(item.name)}`
                        }}
                      />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-cost">
                          <span className="gold-icon">💰</span>
                          {item.cost}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Tooltip on hover - remains but link handles click */}
                  {hoveredItem?.key === item.key && (
                    <motion.div
                      className="item-tooltip"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h4>{item.name}</h4>
                      <p className="item-desc">{item.description}</p>
                      <div className="item-attrs">
                        {item.attributes.map((attr, i) => (
                          <span key={i} className="attr">{attr}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="icon">🔍</span>
            <h3>No items found</h3>
            <p>Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </div>

      <style>{`
        .items-page {
          min-height: 100vh;
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          margin-top: 16px;
        }

        .category-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--color-bg-card);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.8rem;
          transition: var(--transition-normal);
          cursor: pointer;
        }

        .category-tab:hover {
          background: var(--color-bg-card-hover);
          color: var(--text-primary);
        }

        .category-tab.active {
          background: var(--color-accent-blue);
          color: var(--color-bg-dark);
          border-color: var(--color-accent-blue);
        }

        .tab-icon {
          font-size: 1rem;
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

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .item-wrapper {
          position: relative;
        }

        .item-card-link {
          text-decoration: none;
          width: 100%;
          display: block;
        }

        .item-card-large {
          background: var(--gradient-card);
          border: var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          cursor: pointer;
          transition: var(--transition-normal);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: 140px;
        }

        .item-card-large:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .item-card-large img {
          width: 64px;
          height: 48px;
          object-fit: contain;
          margin-bottom: 12px;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-cost {
          font-size: 0.8rem;
          color: var(--color-accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .gold-icon {
          font-size: 0.9rem;
        }

        .item-tooltip {
          position: absolute;
          left: 50%;
          bottom: 100%;
          transform: translateX(-50%);
          width: 280px;
          background: var(--color-bg-dark);
          border: var(--border-accent);
          border-radius: var(--radius-md);
          padding: 16px;
          z-index: 100;
          margin-bottom: 12px;
          box-shadow: var(--shadow-lg);
          text-align: left;
        }

        .item-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: var(--color-accent-blue);
        }

        .item-tooltip h4 {
          color: var(--color-accent-gold);
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .item-desc {
          color: var(--text-secondary);
          font-size: 0.8rem;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .item-attrs {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .item-attrs .attr {
          font-size: 0.75rem;
          color: var(--color-accent-green);
        }

        .counters-info {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }

        .counters-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .counter-type {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: var(--color-accent-red);
          border-radius: var(--radius-sm);
          color: white;
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
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }

          .category-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }

          .tab-label {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default Items
