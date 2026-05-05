import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './Settings.css';

interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    avatar?: string | null;
}

const Settings: React.FC = () => {
    // 1. Initialize user state safely
    const [user, setUser] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { name: 'Guest', email: '', phoneNumber: '' };
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. Form state - linked to user data
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        address: '2 Pham Van Bach, Cau Giay, Ha Noi',
        propertyName: 'FunHome Central'
    });

    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
    };

    // Generic input handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (localStorage limit is ~5MB)
            if (file.size > 1024 * 1024) {
                alert("Image too large. Please choose a file under 1MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const updatedUser = { ...user, avatar: base64String };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        const updatedUser = { ...user, avatar: null };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = { 
            ...user, 
            name: formData.name, 
            email: formData.email, 
            phoneNumber: formData.phone 
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser); // Update local state
        
        alert('Settings saved successfully!');
        // Note: If Header uses AuthContext, it would update automatically without reload.
        // window.location.reload(); 
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Settings" />

                <div className="settings-content">
                    <div className="section-title">
                        <h2>Settings</h2>
                        <p>Manage your profile and property information</p>
                    </div>

                    <div className="settings-card">
                        <div className="avatar-section">
                            <div className="large-avatar-wrapper">
                                {user.avatar ? (
                                    <img src={user.avatar} className="large-avatar-img" alt="Avatar" />
                                ) : (
                                    <div className="avatar-placeholder">{getInitials(user.name)}</div>
                                )}
                            </div>
                            <div className="avatar-actions">
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                                <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                                    <i className="bi bi-cloud-arrow-up"></i> Change Avatar
                                </button>
                                {user.avatar && (
                                    <button className="btn-delete-avt" onClick={handleRemoveAvatar}>
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>

                        <form className="settings-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label><i className="bi bi-person"></i> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><i className="bi bi-envelope"></i> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><i className="bi bi-telephone"></i> Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="btn-save-settings">Save Changes</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;