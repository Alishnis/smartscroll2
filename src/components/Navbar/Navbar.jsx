import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Video, FileText, User, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Navbar.css';

const Navbar = () => {
    const { language } = useLanguage();
    const t = translations[language].nav;

    return (
        <div className="navbar-container">
            <nav className="navbar glass">
                <NavLink to="/feed" title={t.feed} className={({ isActive }) => isActive ? "nav-item active glow-icon" : "nav-item glow-icon"}>
                    <Video size={24} />
                </NavLink>
                <NavLink to="/posts" title={t.posts} className={({ isActive }) => isActive ? "nav-item active nav-blue" : "nav-item"}>
                    <FileText size={24} />
                </NavLink>
                <NavLink to="/groups" title={t.groups} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Users size={24} />
                </NavLink>
                <NavLink to="/facts" title={t.facts} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <BookOpen size={24} />
                </NavLink>
                <NavLink to="/profile" title={t.profile} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <User size={24} />
                </NavLink>
            </nav>
        </div>
    );
};

export default Navbar;
