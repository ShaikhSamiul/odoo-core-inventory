import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Package, History, Settings, User, X } from 'lucide-react';
import styles from './Layout.module.css';

export default function Navbar() {
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
        { name: 'Operations', path: '/operations', icon: <ArrowRightLeft size={18} /> },
        { name: 'Stock', path: '/products', icon: <Package size={18} /> },
        { name: 'Move History', path: '/history', icon: <History size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ];

    return (
        <>
            {/* The Top Navigation Bar */}
            <header className={styles.navbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.logoText}>CoreInventory</h2>
                    
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
                
                {/* Profile Button triggers the Drawer */}
                <button onClick={() => setIsDrawerOpen(true)} className={styles.profileBtn}>
                    <User size={20} />
                    <span>My Profile</span>
                </button>
            </header>

            {/* The Overlay (Darkens background when drawer is open) */}
            {isDrawerOpen && (
                <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)} />
            )}

            {/* The Sliding Right Drawer */}
            <div className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <h3 className={styles.drawerTitle}>Profile & Settings</h3>
                    <button onClick={() => setIsDrawerOpen(false)} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.drawerContent}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} color="#64748b" />
                        </div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>Warehouse Manager</h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>manager@coreinventory.com</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Account Actions</p>
                        <button style={{ textAlign: 'left', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', cursor: 'pointer' }}>Change Password</button>
                        <button style={{ textAlign: 'left', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', cursor: 'pointer' }}>Notification Preferences</button>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button className={styles.logoutBtn}>Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    );
}