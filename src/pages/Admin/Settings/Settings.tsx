import React, { useState, useRef } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './Settings.css';

const Settings: React.FC = () => {
    // 1. Lấy dữ liệu user hiện tại
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. State cho các trường thông tin
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '2 Pham Van Bach, Cau Giay, Ha Noi', // Mock data thêm
        propertyName: 'FunHome Central'
    });

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // 3. Xử lý Upload Avatar
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const updatedUser = { ...user, avatar: base64String };
                setUser(updatedUser);
                // Lưu tạm vào localStorage để Header cập nhật ngay
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    // 4. Xử lý Xóa Avatar
    const handleRemoveAvatar = () => {
        const updatedUser = { ...user, avatar: null };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    // 5. Xử lý Save Changes
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = { ...user, name: formData.name, email: formData.email, phoneNumber: formData.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Settings saved successfully!');
        window.location.reload(); // Reload để đồng bộ toàn bộ app
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Settings" />

                <div className="settings-content">
                    <div className="section-title" style={{ marginBottom: '2rem' }}>
                        <h2>Settings</h2>
                        <p>Manage your profile and property information</p>
                    </div>

                    <div className="settings-card">
                        {/* Avatar Section */}
                        <div className="avatar-section">
                            <div className="large-avatar-wrapper">
                                {user.avatar ? (
                                    <img src={user.avatar} className="large-avatar-img" alt="Avatar" />
                                ) : (
                                    getInitials(user.name)
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

                        {/* Form Section */}
                        <form className="settings-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label><i className="bi bi-person"></i> Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label><i className="bi bi-envelope"></i> Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label><i className="bi bi-telephone"></i> Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {/* <div className="form-group">
                                <label><i className="bi bi-geo-alt"></i> Property Address</label>
                                <textarea
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Property Name</label>
                                <input
                                    type="text"
                                    value={formData.propertyName}
                                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                                />
                            </div> */}

                            <button type="submit" className="btn-save-settings">Save Changes</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;