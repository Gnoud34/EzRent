import React from 'react';
import './Header.css';

interface HeaderProps {
    pageTitle: string; // Truyền tên trang từ component cha
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
    // Lấy thông tin user từ localStorage đã lưu lúc Login
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    // Tạo avatar ký tự viết tắt từ tên (vd: Nguyễn Tuấn Dương -> NT)
    const getInitials = (name: string) => {
        if (!name) return "AD";
        // Tách tên thành mảng, lấy chữ cái đầu của các từ và lấy tối đa 2 chữ cái
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="top-header">
            {/* Bên trái: Tên trang hiện tại */}
            <div className="header-left">
                <h2 className="page-name">{pageTitle}</h2>
            </div>

            {/* Bên phải: Thông tin người dùng */}
            <div className="header-right">
                <div className="user-info">
                    <span className="user-name">{userData.name || 'Admin'}</span>
                    <span className="user-email">{userData.email || 'admin@ezrent.com'}</span>
                </div>

                <div className="user-avatar">
                    {/* KIỂM TRA: Nếu có avatar thì hiện thẻ img, ngược lại hiện chữ cái viết tắt */}
                    {userData.avatar ? (
                        <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="avatar-img"
                            // Xử lý lỗi nếu đường dẫn ảnh bị sai (hiện chữ thay thế)
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerText = getInitials(userData.name);
                            }}
                        />
                    ) : (
                        getInitials(userData.name)
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;