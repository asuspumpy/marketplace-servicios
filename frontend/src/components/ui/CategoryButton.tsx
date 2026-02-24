import React from 'react';

interface CategoryButtonProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({ title, icon, onClick, isActive }) => {
    return (
        <button
            onClick={onClick}
            className={`glass-button flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:border-primary/50 group ${isActive ? 'border-primary shadow-[0_0_20px_rgba(12,235,235,0.3)] bg-white/10' : 'border-white/10 bg-white/5'
                }`}
        >
            <div className={`mb-3 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`}>
                {icon}
            </div>
            <span className={`font-medium tracking-wide ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {title}
            </span>
        </button>
    );
};
