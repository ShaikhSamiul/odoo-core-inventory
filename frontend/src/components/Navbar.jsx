import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Package, History, Settings, User, X, LogIn } from 'lucide-react';
import styles from './Layout.module.css';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    
    // --- THE LOGIC TO GET USER DATA ---
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('inventoryUser')) || {});

    useEffect(() => {
        const handleAuthChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
            // Refresh user data when login happens
            setUserData(JSON.parse(localStorage.getItem('inventoryUser')) || {});
        };

        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('inventoryUser');
        setIsLoggedIn(false);
        setIsDrawerOpen(false);
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
        { name: 'Operations', path: '/operations', icon: <ArrowRightLeft size={18} /> },
        { name: 'Stock', path: '/products', icon: <Package size={18} /> },
        { name: 'Move History', path: '/history', icon: <History size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ];

    return (
        <>
            <header className={styles.navbar}>
                <div className={styles.leftSection}>
                    <h2 className={styles.logoText}>CoreInventory</h2>
                    {isLoggedIn && (
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
                    )}
                </div>
                
                {!isLoggedIn ? (
                    <Link to="/login" className={styles.profileBtn} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                        <LogIn size={20} />
                        <span>Sign In</span>
                    </Link>
                ) : (
                    /* DISPLAY USER NAME IN NAVBAR */
                    <button onClick={() => setIsDrawerOpen(true)} className={styles.profileBtn}>
                        <div style={{ backgroundColor: '#e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
                            <User size={16} color="#475569" />
                        </div>
                        <span style={{ fontWeight: '600' }}>{userData.name || "Profile"}</span>
                    </button>
                )}
            </header>

            {isDrawerOpen && (
                <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)} />
            )}

            <div className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <h3 className={styles.drawerTitle}>User Profile</h3>
                    <button onClick={() => setIsDrawerOpen(false)} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.drawerContent}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#eff6ff', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2563eb' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        {/* DISPLAY USER NAME AND EMAIL IN DRAWER */}
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                            {userData.name}
                        </h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{userData.email}</p>
                    </div>

                    {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</p>
                        <button className={styles.actionBtn}>Profile Settings</button>
                        <button className={styles.actionBtn}>Security & Password</button>
                    </div> */}

                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <button className={styles.logoutBtn} onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    );
}