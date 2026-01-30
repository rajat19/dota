import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Heroes from './pages/Heroes'
import Items from './pages/Items'
import CounterPicker from './pages/CounterPicker'
import HeroDetail from './pages/HeroDetail'
import ItemDetail from './pages/ItemDetail'
import TeamBuilder from './pages/TeamBuilder'

function App() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className={`app ${isLoaded ? 'animate-fadeIn' : ''}`}>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/heroes" element={<Heroes />} />
                    <Route path="/heroes/:heroName" element={<HeroDetail />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/:itemName" element={<ItemDetail />} />
                    <Route path="/counter-picker" element={<CounterPicker />} />
                    <Route path="/team-builder" element={<TeamBuilder />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
