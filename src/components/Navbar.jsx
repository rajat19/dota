import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path ? 'active' : ''
    }

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <div className="logo-icon">⚔️</div>
                    <span className="logo-text">DOTA Counter</span>
                </Link>

                <ul className="nav-links">
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/')}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/heroes" className={`nav-link ${isActive('/heroes')}`}>
                            Heroes
                        </Link>
                    </li>
                    <li>
                        <Link to="/items" className={`nav-link ${isActive('/items')}`}>
                            Items
                        </Link>
                    </li>
                    <li>
                        <Link to="/counter-picker" className={`nav-link ${isActive('/counter-picker')}`}>
                            Counter Picker
                        </Link>
                    </li>
                    <li>
                        <Link to="/team-builder" className={`nav-link ${isActive('/team-builder')}`}>
                            Team Builder
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
