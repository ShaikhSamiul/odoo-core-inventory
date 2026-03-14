import React, { useState } from 'react';
import styles from './Settings.module.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('warehouse');

    // MOCK DATA: In the future, you will fetch these from your MongoDB backend
    const [savedWarehouses, setSavedWarehouses] = useState([
        { id: 1, name: 'Main Store', code: 'WH-MAIN' },
        { id: 2, name: 'Factory Site', code: 'WH-FACT' }
    ]);

    // Form States
    const [warehouseForm, setWarehouseForm] = useState({ name: '', shortCode: '', address: '' });
    const [locationForm, setLocationForm] = useState({ name: '', shortCode: '', warehouse: '' });

    const handleWarehouseSubmit = (e) => {
        e.preventDefault();
        console.log("Saving Warehouse:", warehouseForm);
        // Add API POST request here later
        alert(`Warehouse ${warehouseForm.name} saved!`);
        setWarehouseForm({ name: '', shortCode: '', address: '' });
    };

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        console.log("Saving Location:", locationForm);
        // Add API POST request here later
        alert(`Location ${locationForm.name} saved!`);
        setLocationForm({ name: '', shortCode: '', warehouse: '' });
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>System Settings</h1>

            {/* Tab Navigation */}
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

            {/* WAREHOUSE TAB VIEW */}
            {activeTab === 'warehouse' && (
                <div className={styles.card}>
                    <p className={styles.description}>This page contains the warehouse details & location.</p>
                    
                    <form onSubmit={handleWarehouseSubmit} className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name:</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={warehouseForm.name}
                                onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                                placeholder="e.g., Main Store" 
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Short Code:</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={warehouseForm.shortCode}
                                onChange={(e) => setWarehouseForm({...warehouseForm, shortCode: e.target.value})}
                                placeholder="e.g., WH-MAIN" 
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address:</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={warehouseForm.address}
                                onChange={(e) => setWarehouseForm({...warehouseForm, address: e.target.value})}
                                placeholder="e.g., 123 Industrial Park" 
                                required 
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn}>Save Warehouse</button>
                    </form>
                </div>
            )}

            {/* LOCATION TAB VIEW */}
            {activeTab === 'location' && (
                <div className={styles.card}>
                    <p className={styles.description}>This holds the multiple locations of warehouse, rooms etc..</p>
                    
                    <form onSubmit={handleLocationSubmit} className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name:</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={locationForm.name}
                                onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                                placeholder="e.g., Rack A1" 
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Short Code:</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={locationForm.shortCode}
                                onChange={(e) => setLocationForm({...locationForm, shortCode: e.target.value})}
                                placeholder="e.g., R-A1" 
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Warehouse:</label>
                            <select 
                                className={styles.input}
                                value={locationForm.warehouse}
                                onChange={(e) => setLocationForm({...locationForm, warehouse: e.target.value})}
                                required
                            >
                                <option value="" disabled>Select a Warehouse...</option>
                                {savedWarehouses.map((wh) => (
                                    <option key={wh.id} value={wh.code}>
                                        {wh.name} ({wh.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className={styles.submitBtn}>Save Location</button>
                    </form>
                </div>
            )}

        </div>
    );
}