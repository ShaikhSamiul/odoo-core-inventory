import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, Settings, User } from 'lucide-react';
import styles from './Layout.module.css';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/products', icon: <Package size={20} /> },
        { name: 'Operations', path: '/operations', icon: <ArrowRightLeft size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className={styles.sidebar}>
            <div>
                <div className={styles.logoContainer}>
                    <h2 className={styles.logoText}>CoreInventory</h2>
                </div>
                <nav className={styles.navMenu}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
            
            <div className={styles.profileSection}>
                <Link to="/profile" className={styles.navItem}>
                    <User size={20} />
                    <span>My Profile</span>
                </Link>
            </div>
        </aside>
    );
}