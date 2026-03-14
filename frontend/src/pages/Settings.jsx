import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Settings.module.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('warehouse');
    const [savedWarehouses, setSavedWarehouses] = useState([]);
    const [savedLocations, setSavedLocations] = useState([]);
    const [expandedWarehouseId, setExpandedWarehouseId] = useState(null);

    const [warehouseForm, setWarehouseForm] = useState({ name: '', shortCode: '', address: '' });
    const [locationForm, setLocationForm] = useState({ name: '', shortCode: '', warehouse: '' });

    // Fetch BOTH Warehouses and Locations
    const fetchData = async () => {
        try {
            const whResponse = await axios.get('http://localhost:5000/api/warehouses');
            setSavedWarehouses(whResponse.data);

            const locResponse = await axios.get('http://localhost:5000/api/warehouses/locations');
            setSavedLocations(locResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleWarehouseSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/warehouses', warehouseForm);
            setWarehouseForm({ name: '', shortCode: '', address: '' });
            fetchData(); // Refresh lists immediately
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save warehouse");
        }
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/warehouses/locations', locationForm);
            setLocationForm({ name: '', shortCode: '', warehouse: '' });
            fetchData(); // Refresh lists immediately
            
            // Auto-expand the accordion of the warehouse they just added a location to!
            setExpandedWarehouseId(locationForm.warehouse);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save location");
        }
    };

    const toggleAccordion = (id) => {
        setExpandedWarehouseId(expandedWarehouseId === id ? null : id);
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>System Settings</h1>

            <div className={styles.tabsContainer}>
                <button 
                    className={`${styles.tab} ${activeTab === 'warehouse' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('warehouse')}
                >
                    1. Warehouse
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'location' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('location')}
                >
                    2. Locations
                </button>
            </div>

            {/* WAREHOUSE TAB */}
            {activeTab === 'warehouse' && (
                <div className={styles.contentGrid}>
                    {/* Left Side: Form */}
                    <div className={styles.card}>
                        <p className={styles.description}>This page contains the warehouse details & location.</p>
                        <form onSubmit={handleWarehouseSubmit} className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name:</label>
                                <input type="text" className={styles.input} value={warehouseForm.name} onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})} placeholder="e.g., Main Store" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Short Code:</label>
                                <input type="text" className={styles.input} value={warehouseForm.shortCode} onChange={(e) => setWarehouseForm({...warehouseForm, shortCode: e.target.value})} placeholder="e.g., WH-MAIN" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Address:</label>
                                <input type="text" className={styles.input} value={warehouseForm.address} onChange={(e) => setWarehouseForm({...warehouseForm, address: e.target.value})} placeholder="e.g., 123 Industrial Park" required />
                            </div>
                            <button type="submit" className={styles.submitBtn}>Save Warehouse</button>
                        </form>
                    </div>

                    {/* Right Side: List of Warehouses */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Current Warehouses</h2>
                        {savedWarehouses.length === 0 ? (
                            <p className={styles.emptyState}>No warehouses found. Add one on the left!</p>
                        ) : (
                            <div>
                                {savedWarehouses.map((wh) => (
                                    <div key={wh._id} className={styles.listItem}>
                                        <span className={styles.itemName}>{wh.name}</span>
                                        <span className={styles.itemCode}>Code: {wh.shortCode} | {wh.address}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* LOCATION TAB */}
            {activeTab === 'location' && (
                <div className={styles.contentGrid}>
                    {/* Left Side: Form */}
                    <div className={styles.card}>
                        <p className={styles.description}>This holds the multiple locations of warehouse, rooms etc..</p>
                        <form onSubmit={handleLocationSubmit} className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name:</label>
                                <input type="text" className={styles.input} value={locationForm.name} onChange={(e) => setLocationForm({...locationForm, name: e.target.value})} placeholder="e.g., Rack A1" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Short Code:</label>
                                <input type="text" className={styles.input} value={locationForm.shortCode} onChange={(e) => setLocationForm({...locationForm, shortCode: e.target.value})} placeholder="e.g., R-A1" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Warehouse:</label>
                                <select className={styles.input} value={locationForm.warehouse} onChange={(e) => setLocationForm({...locationForm, warehouse: e.target.value})} required>
                                    <option value="" disabled>Select a Warehouse...</option>
                                    {savedWarehouses.map((wh) => (
                                        <option key={wh._id} value={wh._id}>{wh.name} ({wh.shortCode})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn}>Save Location</button>
                        </form>
                    </div>

                    {/* Right Side: Accordion */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Locations by Warehouse</h2>
                        {savedWarehouses.length === 0 ? (
                            <p className={styles.emptyState}>Create a warehouse first to add locations.</p>
                        ) : (
                            <div>
                                {savedWarehouses.map((wh) => {
                                    // Find all locations that belong to THIS specific warehouse
                                    const whLocations = savedLocations.filter(loc => loc.warehouse?._id === wh._id);
                                    const isExpanded = expandedWarehouseId === wh._id;

                                    return (
                                        <div key={wh._id}>
                                            <div className={styles.accordionHeader} onClick={() => toggleAccordion(wh._id)}>
                                                <span className={styles.itemName}>{wh.name}</span>
                                                {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className={styles.accordionContent}>
                                                    {whLocations.length === 0 ? (
                                                        <p className={styles.emptyState}>No locations mapped to this warehouse yet.</p>
                                                    ) : (
                                                        whLocations.map(loc => (
                                                            <div key={loc._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                                                <span style={{ fontSize: '0.9rem', color: '#334155' }}>{loc.name}</span>
                                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: '#f8fafc', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>{loc.shortCode}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

    