import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Package, History, Settings, User, X, LogIn, Bell } from 'lucide-react';
import axios from 'axios';
import styles from './Layout.module.css';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Notification States
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [lowStockItems, setLowStockItems] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('inventoryUser')) || {});

    useEffect(() => {
        // Fetch notifications if logged in
        if (isLoggedIn) {
            fetchNotifications();
        }

        const handleAuthChange = () => {
            const loggedIn = !!localStorage.getItem('token');
            setIsLoggedIn(loggedIn);
            setUserData(JSON.parse(localStorage.getItem('inventoryUser')) || {});
            if (loggedIn) fetchNotifications();
        };

        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, [isLoggedIn]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            // Logic: Filter items where stock is less than or equal to threshold
            const alerts = res.data.filter(p => p.stock <= (p.lowStockThreshold || 5));
            setLowStockItems(alerts);
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('inventoryUser');
        setIsLoggedIn(false);
        setIsDrawerOpen(false);
        setIsNotifOpen(false);
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!isLoggedIn ? (
                        <Link to="/login" className={styles.profileBtn} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                            <LogIn size={20} />
                            <span>Sign In</span>
                        </Link>
                    ) : (
                        <>
                            {/* NOTIFICATION SECTION */}
                            <div style={{ position: 'relative', cursor: 'pointer' }}>
                                <Bell 
                                    size={20} 
                                    color="#475569" 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)} 
                                />
                                {lowStockItems.length > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontSize: '10px',
                                        padding: '2px 5px',
                                        borderRadius: '50%',
                                        fontWeight: 'bold'
                                    }}>
                                        {lowStockItems.length}
                                    </span>
                                )}

                                {isNotifOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '35px',
                                        right: '0',
                                        width: '260px',
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        zIndex: 1000,
                                        padding: '12px'
                                    }}>
                                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                                            Notifications
                                        </p>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {lowStockItems.length === 0 ? (
                                                <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>No low stock alerts</p>
                                            ) : (
                                                lowStockItems.map(item => (
                                                    <div key={item._id} style={{ padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: '12px' }}>
                                                        ⚠️ <strong>{item.name}</strong> is low! <br/>
                                                        Current count: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.stock}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PROFILE BUTTON */}
                            <button onClick={() => setIsDrawerOpen(true)} className={styles.profileBtn}>
                                <div style={{ backgroundColor: '#e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
                                    <User size={16} color="#475569" />
                                </div>
                                <span style={{ fontWeight: '600' }}>{userData.name || "Profile"}</span>
                            </button>
                        </>
                    )}
                </div>
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
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                            {userData.name}
                        </h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{userData.email}</p>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <button className={styles.logoutBtn} onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    );
}