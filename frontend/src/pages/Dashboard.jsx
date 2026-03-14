// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, Truck, ArrowRightLeft, RefreshCw } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const [kpis, setKpis] = useState({ 
        totalProducts: 0, 
        lowStock: 0, 
        pendingReceipts: 0, 
        pendingDeliveries: 0, 
        internalTransfers: 0 
    });
    const [operations, setOperations] = useState([]);
    const [filters, setFilters] = useState({ type: '', status: '', category: '', location: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/operations/dashboard');
            setKpis(response.data.kpis);
            setOperations(response.data.operations);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredOperations = operations.filter(op => {
        const matchType = filters.type ? op.type === filters.type : true;
        const matchStatus = filters.status ? op.status === filters.status : true;
        const matchCategory = filters.category ? op.product?.category === filters.category : true;
        const matchLocation = filters.location 
            ? (op.fromLocation === filters.location || op.toLocation === filters.location || op.product?.location === filters.location)
            : true;
        return matchType && matchStatus && matchCategory && matchLocation;
    });

    // Dynamically extract unique values, ensuring "Accessories" is always available
    const uniqueCategories = [...new Set([
        ...operations.map(op => op.product?.category),
        "Accessories", "Laptops", "Smartphones", "Audio", "Displays"
    ].filter(Boolean))];

    const uniqueLocations = [...new Set([
        ...operations.map(op => op.fromLocation),
        ...operations.map(op => op.toLocation),
        ...operations.map(op => op.product?.location),
        "Warehouse 1", "Warehouse 2", "Warehouse 3"
    ].filter(Boolean))];

    return (
        <div style={{ padding: '20px' }}>
            <h1 className={styles.pageTitle}>Inventory Dashboard</h1>
            
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
                <KPICard title="Total Products" value={kpis.totalProducts} icon={<Package size={24} />} colorClass={styles.bgBlue} />
                <KPICard title="Low Stock Items" value={kpis.lowStock} icon={<AlertTriangle size={24} />} colorClass={styles.bgRed} />
                <KPICard title="Pending Receipts" value={kpis.pendingReceipts} icon={<Truck size={24} />} colorClass={styles.bgGreen} />
                <KPICard title="Pending Deliveries" value={kpis.pendingDeliveries} icon={<ArrowRightLeft size={24} />} colorClass={styles.bgYellow} />
                <KPICard title="Internal Transfers" value={kpis.internalTransfers} icon={<RefreshCw size={24} />} colorClass={styles.bgBlue} />
            </div>

            <div className={styles.recentSection} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', marginTop: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Operations Overview</h2>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <select name="type" value={filters.type} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">All Types</option>
                        <option value="Receipt">Receipts</option>
                        <option value="Delivery">Deliveries</option>
                        <option value="Internal">Internal Transfers</option>
                    </select>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Ready">Ready</option>
                        <option value="Done">Done</option>
                    </select>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">All Categories</option>
                        {uniqueCategories.sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select name="location" value={filters.location} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">All Locations</option>
                        {uniqueLocations.sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>

                {/* Table Header Labels (Optional, for better alignment) */}
                <div style={{ display: 'flex', padding: '10px 0', borderBottom: '2px solid #f7fafc', color: '#a0aec0', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ width: '46px' }}></span>
                    <span style={{ width: '80px' }}>Type</span>
                    <span style={{ flex: 1 }}>Product & Quantity</span>
                    <span style={{ width: '120px' }}>Category</span>
                    <span style={{ width: '100px', textAlign: 'right' }}>Status</span>
                </div>

                {/* Operations List */}
                <div style={{ borderTop: 'none' }}>
                    {filteredOperations.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#a0aec0', padding: '40px 0' }}>No movements found.</p>
                    ) : (
                        filteredOperations.map(op => (
                            <div key={op._id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '16px 0', 
                                borderBottom: '1px solid #edf2f7',
                                gap: '16px'
                            }}>
                                <span style={{ width: '30px', textAlign: 'center', fontSize: '1.2rem' }}>{getOpIcon(op.type)}</span>
                                <span style={{ width: '80px', fontWeight: 'bold', fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>{op.type}</span>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{op.product?.name}</span>
                                    <span style={{ color: '#a0aec0', marginLeft: '8px', fontSize: '14px' }}>({op.quantity} {op.product?.uom || 'Pcs'})</span>
                                </div>
                                <span style={{ width: '120px', color: '#718096', fontSize: '14px' }}>{op.product?.category}</span>
                                <div style={{ width: '100px', textAlign: 'right' }}>
                                    <StatusBadge status={op.status} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Helpers
function getOpIcon(type) {
    switch(type) {
        case 'Receipt': return '📦';
        case 'Delivery': return '🚚';
        case 'Internal': return '🔄';
        default: return '📄';
    }
}

function StatusBadge({ status }) {
    const getStyles = (s) => {
        switch(s) {
            case 'Done': return { bg: '#c6f6d5', text: '#22543d' };
            case 'Waiting': return { bg: '#feebc8', text: '#744210' };
            case 'Ready': return { bg: '#bee3f8', text: '#2a4365' };
            case 'Draft': return { bg: '#edf2f7', text: '#2d3748' };
            default: return { bg: '#fed7d7', text: '#822727' };
        }
    };
    const { bg, text } = getStyles(status);
    return (
        <span style={{ 
            backgroundColor: bg, 
            color: text, 
            padding: '4px 12px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: '700',
            display: 'inline-block',
            textAlign: 'center',
            minWidth: '70px'
        }}>{status}</span>
    );
}

function KPICard({ title, value, icon, colorClass }) {
    return (
        <div className={styles.kpiCard}>
            <div className={`${styles.iconWrapper} ${colorClass}`}>{icon}</div>
            <div>
                <p className={styles.kpiLabel}>{title}</p>
                <p className={styles.kpiValue}>{value}</p>
            </div>
        </div>
    );
}