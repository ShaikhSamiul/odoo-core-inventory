import React, { useState } from 'react';
import { Package, AlertTriangle, Truck, ArrowRightLeft } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    // In a real app, fetch these via axios from your backend
    const [kpis] = useState({
        totalProducts: 1240,
        lowStock: 12,
        pendingReceipts: 5,
        pendingDeliveries: 8
    });

    return (
        <div>
            <h1 className={styles.pageTitle}>Inventory Dashboard</h1>
            
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
                <KPICard title="Total Products" value={kpis.totalProducts} icon={<Package size={24} />} colorClass={styles.bgBlue} />
                <KPICard title="Low Stock Items" value={kpis.lowStock} icon={<AlertTriangle size={24} />} colorClass={styles.bgRed} />
                <KPICard title="Pending Receipts" value={kpis.pendingReceipts} icon={<Truck size={24} />} colorClass={styles.bgGreen} />
                <KPICard title="Pending Deliveries" value={kpis.pendingDeliveries} icon={<ArrowRightLeft size={24} />} colorClass={styles.bgYellow} />
            </div>

            {/* Recent Activity */}
            <div className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Operations</h2>
                    <select className={styles.filterSelect}>
                        <option>All Types</option>
                        <option>Receipts</option>
                        <option>Deliveries</option>
                    </select>
                </div>
                <div>
                    <div className={styles.operationItem}>
                        <span>📦</span> <span>Receipt #001 - 50x Steel Rods (Done)</span>
                    </div>
                    <div className={styles.operationItem}>
                        <span>🚚</span> <span>Delivery #042 - 10x Office Chairs (Waiting)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for the cards
function KPICard({ title, value, icon, colorClass }) {
    return (
        <div className={styles.kpiCard}>
            <div className={`${styles.iconWrapper} ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className={styles.kpiLabel}>{title}</p>
                <p className={styles.kpiValue}>{value}</p>
            </div>
        </div>
    );
}