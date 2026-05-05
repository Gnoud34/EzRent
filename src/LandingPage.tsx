import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="landing-container">
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="logo">
                    <i className="bi bi-house-heart-fill"></i>
                    <span>EZRent</span>
                </div>
                <div className="nav-actions">
                    <div className="user-profile">
                        <span className="welcome-text">Welcome back,</span>
                        <span className="user-name">{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>
            </nav>

            <header className="landing-hero">
                <div className="hero-content">
                    <span className="badge">Tenant Dashboard</span>
                    <h1>Hello, {user?.name.split(' ').pop()}! 👋</h1>
                    <p>Everything you need to manage your stay in one place.</p>
                </div>
                <div className="hero-waves">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#f8fafc" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </header>

            <main className="content-section">
                <div className="features-grid">
                    <div className="feature-card bill-card" onClick={() => navigate('/bills')}>
                        <div className="icon-box"><i className="bi bi-credit-card-2-front"></i></div>
                        <h3>My Bills</h3>
                        <p>Track your payments and download monthly invoices.</p>
                        <span className="card-link">View Details <i className="bi bi-arrow-right"></i></span>
                    </div>

                    <div className="feature-card maintenance-card" onClick={() => navigate('/user-request')}>
                        <div className="icon-box"><i className="bi bi-tools"></i></div>
                        <h3>Maintenance</h3>
                        <p>Is something broken? Send a repair request instantly.</p>
                        <span className="card-link">Send Request <i className="bi bi-arrow-right"></i></span>
                    </div>

                    <div className="feature-card room-card" onClick={() => navigate('/room-info')}>
                        <div className="icon-box"><i className="bi bi-shield-lock"></i></div>
                        <h3>Room Info</h3>
                        <p>Check your contract terms and room amenities.</p>
                        <span className="card-link">Learn More <i className="bi bi-arrow-right"></i></span>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p>© 2026 EZRent Management System. Stay comfortable.</p>
            </footer>
        </div>
    );
};

export default LandingPage;