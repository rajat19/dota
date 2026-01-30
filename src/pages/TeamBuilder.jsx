import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { allHeroes } from '../data/heroData'

function TeamBuilder() {
    const [radiantTeam, setRadiantTeam] = useState([null, null, null, null, null])
    const [direTeam, setDireTeam] = useState([null, null, null, null, null])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSlot, setSelectedSlot] = useState({ team: null, index: null })
    const [filterAttr, setFilterAttr] = useState('all')

    // Filter available heroes
    const availableHeroes = useMemo(() => {
        const selectedIds = [...radiantTeam, ...direTeam].filter(Boolean).map(h => h.id)
        return allHeroes.filter(hero => {
            const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
            const notSelected = !selectedIds.includes(hero.id)
            const matchesAttr = filterAttr === 'all' || hero.primaryAttr === filterAttr
            return matchesSearch && notSelected && matchesAttr
        })
    }, [searchQuery, radiantTeam, direTeam, filterAttr])

    // Select hero for slot
    const selectHero = useCallback((hero) => {
        if (!selectedSlot.team) return
        if (selectedSlot.team === 'radiant') {
            const newTeam = [...radiantTeam]
            newTeam[selectedSlot.index] = hero
            setRadiantTeam(newTeam)
        } else {
            const newTeam = [...direTeam]
            newTeam[selectedSlot.index] = hero
            setDireTeam(newTeam)
        }
        setSelectedSlot({ team: null, index: null })
    }, [selectedSlot, radiantTeam, direTeam])

    // Remove hero from slot
    const removeHero = useCallback((team, index) => {
        if (team === 'radiant') {
            const newTeam = [...radiantTeam]
            newTeam[index] = null
            setRadiantTeam(newTeam)
        } else {
            const newTeam = [...direTeam]
            newTeam[index] = null
            setDireTeam(newTeam)
        }
    }, [radiantTeam, direTeam])

    // Team analysis
    const teamAnalysis = useMemo(() => {
        const analyze = (team) => {
            const heroes = team.filter(Boolean)
            if (heroes.length === 0) return null

            const roles = {}
            const attrs = { str: 0, agi: 0, int: 0 }
            let totalStr = 0, totalAgi = 0, totalInt = 0
            let meleeCount = 0, rangedCount = 0

            heroes.forEach(h => {
                h.roles.forEach(r => { roles[r] = (roles[r] || 0) + 1 })
                attrs[h.primaryAttr]++
                totalStr += h.baseStr
                totalAgi += h.baseAgi
                totalInt += h.baseInt
                if (h.attackType === 'Melee') meleeCount++
                else rangedCount++
            })

            const sortedRoles = Object.entries(roles).sort((a, b) => b[1] - a[1]).slice(0, 5)

            // Strengths and weaknesses
            const strengths = []
            const weaknesses = []

            if (roles['Disabler'] >= 2) strengths.push('Strong lockdown')
            if (roles['Carry'] >= 2) strengths.push('High damage potential')
            if (roles['Support'] >= 2) strengths.push('Good team support')
            if (roles['Initiator'] >= 1) strengths.push('Good initiation')
            if (roles['Pusher'] >= 2) strengths.push('Strong pushing')
            if (attrs.str >= 2) strengths.push('Tanky frontline')

            if (!roles['Support']) weaknesses.push('Lacks support')
            if (!roles['Carry']) weaknesses.push('Lacks late game')
            if (!roles['Disabler']) weaknesses.push('Lacks disable')
            if (meleeCount >= 4) weaknesses.push('Too many melee')
            if (rangedCount >= 4) weaknesses.push('No frontline')
            if (attrs.str === 0) weaknesses.push('Squishy lineup')

            return { roles: sortedRoles, attrs, strengths, weaknesses, meleeCount, rangedCount }
        }

        return { radiant: analyze(radiantTeam), dire: analyze(direTeam) }
    }, [radiantTeam, direTeam])

    // Clear teams
    const clearTeams = () => {
        setRadiantTeam([null, null, null, null, null])
        setDireTeam([null, null, null, null, null])
    }

    return (
        <div className="team-builder-page">
            <div className="container">
                <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>🏗️ Team Builder</h1>
                    <p>Build and analyze team compositions for both Radiant and Dire</p>
                </motion.div>

                <div className="builder-layout">
                    {/* Teams Panel */}
                    <div className="teams-panel">
                        {/* Radiant Team */}
                        <motion.div className="team-section radiant" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="team-header">
                                <h2>☀️ Radiant</h2>
                                <span className="team-count">{radiantTeam.filter(Boolean).length}/5</span>
                            </div>
                            <div className="team-slots">
                                {radiantTeam.map((hero, idx) => (
                                    <div
                                        key={idx}
                                        className={`team-slot ${hero ? 'filled' : ''} ${selectedSlot.team === 'radiant' && selectedSlot.index === idx ? 'selected' : ''}`}
                                        onClick={() => !hero && setSelectedSlot({ team: 'radiant', index: idx })}
                                    >
                                        {hero ? (
                                            <>
                                                <img src={hero.image} alt={hero.name} />
                                                <span className="slot-name">{hero.name}</span>
                                                <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeHero('radiant', idx) }}>✕</button>
                                            </>
                                        ) : (
                                            <span className="slot-empty">+</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {teamAnalysis.radiant && (
                                <div className="team-analysis">
                                    <div className="analysis-section">
                                        <span className="label">Roles:</span>
                                        <div className="role-tags">{teamAnalysis.radiant.roles.map(([role, count]) => (<span key={role} className="role-tag">{role} ×{count}</span>))}</div>
                                    </div>
                                    <div className="analysis-section">
                                        <span className="label">Attributes:</span>
                                        <div className="attr-stats">
                                            <span className="attr str">💪 {teamAnalysis.radiant.attrs.str}</span>
                                            <span className="attr agi">🎯 {teamAnalysis.radiant.attrs.agi}</span>
                                            <span className="attr int">🧠 {teamAnalysis.radiant.attrs.int}</span>
                                        </div>
                                    </div>
                                    {teamAnalysis.radiant.strengths.length > 0 && (
                                        <div className="analysis-section strengths">
                                            <span className="label">✅ Strengths:</span>
                                            <div className="tags">{teamAnalysis.radiant.strengths.map(s => <span key={s}>{s}</span>)}</div>
                                        </div>
                                    )}
                                    {teamAnalysis.radiant.weaknesses.length > 0 && (
                                        <div className="analysis-section weaknesses">
                                            <span className="label">⚠️ Weaknesses:</span>
                                            <div className="tags">{teamAnalysis.radiant.weaknesses.map(w => <span key={w}>{w}</span>)}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Dire Team */}
                        <motion.div className="team-section dire" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="team-header">
                                <h2>🌙 Dire</h2>
                                <span className="team-count">{direTeam.filter(Boolean).length}/5</span>
                            </div>
                            <div className="team-slots">
                                {direTeam.map((hero, idx) => (
                                    <div
                                        key={idx}
                                        className={`team-slot ${hero ? 'filled' : ''} ${selectedSlot.team === 'dire' && selectedSlot.index === idx ? 'selected' : ''}`}
                                        onClick={() => !hero && setSelectedSlot({ team: 'dire', index: idx })}
                                    >
                                        {hero ? (
                                            <>
                                                <img src={hero.image} alt={hero.name} />
                                                <span className="slot-name">{hero.name}</span>
                                                <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeHero('dire', idx) }}>✕</button>
                                            </>
                                        ) : (
                                            <span className="slot-empty">+</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {teamAnalysis.dire && (
                                <div className="team-analysis">
                                    <div className="analysis-section">
                                        <span className="label">Roles:</span>
                                        <div className="role-tags">{teamAnalysis.dire.roles.map(([role, count]) => (<span key={role} className="role-tag">{role} ×{count}</span>))}</div>
                                    </div>
                                    <div className="analysis-section">
                                        <span className="label">Attributes:</span>
                                        <div className="attr-stats">
                                            <span className="attr str">💪 {teamAnalysis.dire.attrs.str}</span>
                                            <span className="attr agi">🎯 {teamAnalysis.dire.attrs.agi}</span>
                                            <span className="attr int">🧠 {teamAnalysis.dire.attrs.int}</span>
                                        </div>
                                    </div>
                                    {teamAnalysis.dire.strengths.length > 0 && (
                                        <div className="analysis-section strengths">
                                            <span className="label">✅ Strengths:</span>
                                            <div className="tags">{teamAnalysis.dire.strengths.map(s => <span key={s}>{s}</span>)}</div>
                                        </div>
                                    )}
                                    {teamAnalysis.dire.weaknesses.length > 0 && (
                                        <div className="analysis-section weaknesses">
                                            <span className="label">⚠️ Weaknesses:</span>
                                            <div className="tags">{teamAnalysis.dire.weaknesses.map(w => <span key={w}>{w}</span>)}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Hero Picker */}
                    <motion.div className="picker-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="picker-header">
                            <h3>Select Hero {selectedSlot.team && `for ${selectedSlot.team === 'radiant' ? '☀️ Radiant' : '🌙 Dire'}`}</h3>
                            <button className="btn-clear" onClick={clearTeams}>Clear All</button>
                        </div>
                        <input type="text" className="search-input" placeholder="🔍 Search heroes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="filter-buttons">
                            {['all', 'str', 'agi', 'int'].map(attr => (
                                <button key={attr} className={`filter-btn ${filterAttr === attr ? 'active' : ''}`} onClick={() => setFilterAttr(attr)}>
                                    {attr === 'all' ? '⭐ All' : attr === 'str' ? '💪 STR' : attr === 'agi' ? '🎯 AGI' : '🧠 INT'}
                                </button>
                            ))}
                        </div>
                        <div className="hero-picker-grid">
                            <AnimatePresence>
                                {availableHeroes.slice(0, 40).map((hero) => (
                                    <motion.button key={hero.id} className="picker-hero" onClick={() => selectHero(hero)} disabled={!selectedSlot.team} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} whileHover={{ scale: 1.05 }}>
                                        <img src={hero.image} alt={hero.name} />
                                        <span>{hero.name}</span>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                <div className="builder-actions">
                    <Link to="/counter-picker" className="btn btn-primary">🎯 Find Counters</Link>
                </div>
            </div>

            <style>{`
        .team-builder-page { min-height: 100vh; }
        .builder-layout { display: grid; grid-template-columns: 1fr 400px; gap: 24px; }
        @media (max-width: 1024px) { .builder-layout { grid-template-columns: 1fr; } }
        .teams-panel { display: flex; flex-direction: column; gap: 24px; }
        .team-section { background: var(--gradient-card); border: var(--border-subtle); border-radius: var(--radius-xl); padding: 24px; }
        .team-section.radiant { border-left: 4px solid #4ade80; }
        .team-section.dire { border-left: 4px solid #ef4444; }
        .team-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .team-header h2 { font-size: 1.25rem; }
        .team-count { color: var(--text-muted); font-size: 0.9rem; }
        .team-slots { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 16px; }
        .team-slot { aspect-ratio: 3/4; background: var(--color-bg-secondary); border: 2px dashed rgba(255,255,255,0.2); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: var(--transition-normal); overflow: hidden; }
        .team-slot.selected { border-color: var(--color-accent-gold); border-style: solid; box-shadow: var(--shadow-glow-gold); }
        .team-slot.filled { border-style: solid; border-color: rgba(255,255,255,0.3); }
        .team-slot img { width: 100%; height: 100%; object-fit: cover; }
        .team-slot .slot-name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.9)); padding: 16px 4px 4px; font-size: 0.6rem; text-align: center; }
        .team-slot .slot-empty { font-size: 2rem; color: var(--text-muted); }
        .team-slot .remove-btn { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: var(--color-accent-red); border: none; border-radius: 50%; color: white; font-size: 0.6rem; opacity: 0; transition: var(--transition-fast); display: flex; align-items: center; justify-content: center; }
        .team-slot:hover .remove-btn { opacity: 1; }
        .team-analysis { background: var(--color-bg-secondary); border-radius: var(--radius-md); padding: 16px; }
        .analysis-section { margin-bottom: 12px; }
        .analysis-section:last-child { margin-bottom: 0; }
        .analysis-section .label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 6px; }
        .role-tags, .attr-stats, .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .role-tag { font-size: 0.7rem; padding: 2px 8px; background: var(--color-bg-tertiary); border-radius: var(--radius-sm); }
        .attr { font-size: 0.8rem; font-weight: 600; }
        .attr.str { color: var(--color-str); }
        .attr.agi { color: var(--color-agi); }
        .attr.int { color: var(--color-int); }
        .strengths .tags span { font-size: 0.7rem; padding: 2px 8px; background: rgba(74, 222, 128, 0.2); color: #4ade80; border-radius: var(--radius-sm); }
        .weaknesses .tags span { font-size: 0.7rem; padding: 2px 8px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border-radius: var(--radius-sm); }
        .picker-panel { background: var(--gradient-card); border: var(--border-subtle); border-radius: var(--radius-xl); padding: 24px; max-height: 80vh; overflow-y: auto; }
        .picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .picker-header h3 { font-size: 1rem; color: var(--text-primary); }
        .btn-clear { padding: 6px 12px; background: transparent; border: var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
        .picker-panel .search-input { width: 100%; margin-bottom: 12px; }
        .picker-panel .filter-buttons { margin-bottom: 16px; }
        .hero-picker-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .picker-hero { aspect-ratio: 1; background: var(--color-bg-secondary); border: var(--border-subtle); border-radius: var(--radius-md); padding: 0; overflow: hidden; cursor: pointer; position: relative; }
        .picker-hero:disabled { opacity: 0.4; cursor: not-allowed; }
        .picker-hero:hover:not(:disabled) { border-color: var(--color-accent-blue); }
        .picker-hero img { width: 100%; height: 100%; object-fit: cover; }
        .picker-hero span { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.9)); padding: 8px 2px 2px; font-size: 0.5rem; text-align: center; }
        .builder-actions { margin-top: 32px; text-align: center; }
      `}</style>
        </div>
    )
}

export default TeamBuilder
