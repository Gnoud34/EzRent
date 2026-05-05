import React from 'react';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => {
    return (
        <div className="stat-card">
            <div className="stat-info">
                <p>{title}</p>
                <div className="stat-value">{value}</div>
            </div>
            <div className="stat-icon" style={{ color: color, backgroundColor: bgColor }}>
                <i className={`bi ${icon}`}></i>
            </div>
        </div>
    );
};

export default StatCard;