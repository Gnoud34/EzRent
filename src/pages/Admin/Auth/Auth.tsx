import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockData from '../../../data/mockdata.json'; 
import './Auth.css';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            // 1. Tìm user trong mockData
            const userFound = mockData.users.find(
                (u) => u.email === email && u.password === password
            );

            if (userFound) {
                localStorage.setItem('user', JSON.stringify(userFound));

                console.log('Đăng nhập thành công với vai trò:', userFound.role);

                if (userFound.role === 'admin') {
                    navigate('/dashboard');
                } else if (userFound.role === 'tenant') {
                    navigate('/tenant/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                console.error('Đăng nhập thất bại');
                alert('Sai email hoặc mật khẩu! (Thử: ntd@gmail.com / password123)');
            }

        } else {
            console.log('Đang đăng ký tài khoản mới:', { name, email, password });
            alert('Đăng ký thành công! Hãy đăng nhập.');
            setIsLogin(true);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <i className="bi bi-house-door-fill"></i>
                        EzRent
                    </div>
                    <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Please enter your details to sign in' : 'Join us to manage your rooms easily'}</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <i className="bi bi-person"></i>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <i className="bi bi-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email (vd: ntd@gmail.com)"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <i className="bi bi-lock"></i>
                            <input
                                type="password"
                                placeholder="Mật khẩu (vd: password123)"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-auth">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#2563eb', marginLeft: '5px' }}>
                        {isLogin ? 'Create one' : 'Login now'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;