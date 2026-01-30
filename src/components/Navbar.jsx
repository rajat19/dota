import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../firebase/auth'
import AuthModal from './AuthModal'

function Navbar() {
    const location = useLocation()
    const { user, isAuthenticated, loading } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const isActive = (path) => {
        return location.pathname === path ? 'active' : ''
    }

    const handleSignOut = async () => {
        await signOut()
        setShowUserMenu(false)
    }

    return (
        <>
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

                    <div className="nav-auth">
                        {loading ? (
                            <div className="nav-auth-loading">...</div>
                        ) : isAuthenticated ? (
                            <div className="user-menu-container">
                                <button
                                    className="user-avatar-btn"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            {user.displayName?.[0] || user.email?.[0] || '?'}
                                        </div>
                                    )}
                                </button>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <span className="user-name">{user.displayName || 'User'}</span>
                                            <span className="user-email">{user.email}</span>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/my-builds" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                            📁 My Builds
                                        </Link>
                                        <Link to="/favorites" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                            ⭐ Favorites
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout" onClick={handleSignOut}>
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="login-btn"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            <style>{`
                .nav-auth {
                    display: flex;
                    align-items: center;
                    margin-left: 1.5rem;
                }

                .nav-auth-loading {
                    color: #888;
                }

                .login-btn {
                    padding: 0.5rem 1.25rem;
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .login-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                }

                .user-menu-container {
                    position: relative;
                }

                .user-avatar-btn {
                    background: none;
                    border: 2px solid transparent;
                    border-radius: 50%;
                    padding: 0;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }

                .user-avatar-btn:hover {
                    border-color: #e74c3c;
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-avatar-placeholder {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1rem;
                    text-transform: uppercase;
                }

                .user-dropdown {
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    right: 0;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    min-width: 220px;
                    padding: 0.5rem 0;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    z-index: 100;
                }

                .user-info {
                    padding: 0.75rem 1rem;
                }

                .user-name {
                    display: block;
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.95rem;
                }

                .user-email {
                    display: block;
                    color: #888;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                }

                .dropdown-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0.5rem 0;
                }

                .dropdown-item {
                    display: block;
                    width: 100%;
                    padding: 0.6rem 1rem;
                    background: none;
                    border: none;
                    color: #ccc;
                    text-decoration: none;
                    font-size: 0.9rem;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                }

                .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                }

                .dropdown-item.logout {
                    color: #e74c3c;
                }

                .dropdown-item.logout:hover {
                    background: rgba(231, 76, 60, 0.1);
                }

                @media (max-width: 768px) {
                    .nav-auth {
                        margin-left: 0.5rem;
                    }
                    
                    .login-btn {
                        padding: 0.4rem 0.75rem;
                        font-size: 0.85rem;
                    }
                }
            `}</style>
        </>
    )
}

export default Navbar

