import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo">EZRent Portal</div>
                <div className="nav-actions">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout-lite">Logout</button>
                </div>
            </nav>

            <div className="landing-hero">
                <h1>Hi {user?.name}, Welcome Home!</h1>
                <p>Manage your room and requests easily.</p>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <i className="bi bi-receipt"></i>
                    <h3>My Bills</h3>
                    <p>View and pay your monthly rent.</p>
                </div>
                <div className="feature-card" onClick={() => navigate('/maintenance')}>
                    <i className="bi bi-tools"></i>
                    <h3>Repair Request</h3>
                    <p>Report issues in your room.</p>
                </div>
                <div className="feature-card">
                    <i className="bi bi-info-circle"></i>
                    <h3>Room Info</h3>
                    <p>Details about your contract.</p>
                </div>
            </div>

            <style>{`
                .landing-container { font-family: 'Inter', sans-serif; min-height: 100vh; background: #f8fafc; }
                .landing-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .logo { font-weight: bold; color: #2563eb; font-size: 24px; }
                .landing-hero { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; }
                .features-grid { display: flex; justify-content: center; gap: 30px; padding: 50px 5%; margin-top: -50px; }
                .feature-card { background: white; padding: 30px; border-radius: 15px; width: 250px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); cursor: pointer; transition: 0.3s; }
                .feature-card:hover { transform: translateY(-10px); }
                .feature-card i { font-size: 40px; color: #2563eb; }
                .btn-logout-lite { margin-left: 15px; padding: 5px 15px; border: 1px solid #dc2626; color: #dc2626; background: none; border-radius: 5px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default LandingPage;