// Login/Signup Modal Component
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase/auth';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        const result = await signInWithGoogle();
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (isLogin) {
            result = await signInWithEmail(email, password);
        } else {
            if (!displayName.trim()) {
                setError('Display name is required');
                setLoading(false);
                return;
            }
            result = await signUpWithEmail(email, password, displayName);
        }

        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setDisplayName('');
        setError('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="auth-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="auth-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="auth-close" onClick={onClose}>×</button>

                    <div className="auth-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Sign in to save your builds' : 'Join to save and share builds'}</p>
                    </div>

                    <button
                        className="google-btn"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <form onSubmit={handleEmailSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={toggleMode} className="auth-toggle">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            <style>{`
                .auth-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .auth-modal {
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 16px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .auth-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .auth-close:hover {
                    color: #fff;
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .auth-header h2 {
                    color: #fff;
                    margin: 0 0 0.5rem;
                    font-size: 1.5rem;
                }

                .auth-header p {
                    color: #888;
                    margin: 0;
                    font-size: 0.9rem;
                }

                .google-btn {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: #fff;
                    color: #333;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    transition: all 0.2s;
                }

                .google-btn:hover {
                    background: #f5f5f5;
                    transform: translateY(-1px);
                }

                .google-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    margin: 1.5rem 0;
                    color: #666;
                }

                .auth-divider::before,
                .auth-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .auth-divider span {
                    padding: 0 1rem;
                    font-size: 0.85rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-group label {
                    display: block;
                    color: #aaa;
                    font-size: 0.85rem;
                    margin-bottom: 0.5rem;
                }

                .form-group input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #fff;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #e74c3c;
                }

                .form-group input::placeholder {
                    color: #666;
                }

                .auth-error {
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    color: #e74c3c;
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .auth-submit {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .auth-submit:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                }

                .auth-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: #888;
                    font-size: 0.9rem;
                }

                .auth-toggle {
                    background: none;
                    border: none;
                    color: #e74c3c;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .auth-toggle:hover {
                    text-decoration: underline;
                }
            `}</style>
        </AnimatePresence>
    );
};

export default AuthModal;
