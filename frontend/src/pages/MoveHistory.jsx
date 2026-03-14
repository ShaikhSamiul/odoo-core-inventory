import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, List, LayoutGrid } from 'lucide-react';
import styles from './Products.module.css';

export default function MoveHistory() {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/operations');
            setHistory(res.data);
        } catch (err) {
            console.error("Connection failed. Is the backend running?", err);
        }
    };

    // Filter logic for the search bar
    const filteredHistory = history.filter(item => 
        item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            {/* Wireframe Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className={styles.addButton}>NEW</button>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Move History</h1>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '5px 15px', borderRadius: '8px' }}>
                    <Search size={18} color="#64748b" />
                    <input 
                        type="text" 
                        placeholder="Search Reference..." 
                        style={{ border: 'none', background: 'transparent', outline: 'none', padding: '5px' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={{ borderLeft: '1px solid #cbd5e1', height: '20px', margin: '0 10px' }}></div>
                    <List size={20} style={{ cursor: 'pointer' }} color="#2563eb" />
                    <LayoutGrid size={20} style={{ cursor: 'pointer' }} color="#64748b" />
                </div>
            </div>

            {/* Wireframe Table Structure */}
            <div className={styles.tableContainer}>
                <table className={styles.productTable}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <th>Reference</th>
                            <th>Date</th>
                            <th>Contact/Product</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((item) => {
                            // Color logic from your wireframe: In (Green), Out (Red)
                            const isIncoming = item.type === 'Receipt';
                            const rowColor = isIncoming ? '#059669' : '#dc2626';

                            return (
                                <tr key={item._id}>
                                    <td style={{ fontWeight: '600', color: '#1e293b' }}>{item.reference || 'N/A'}</td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontStyle: 'italic', color: '#475569' }}>
                                        {item.product?.name || 'Unknown Contact'}
                                    </td>
                                    <td style={{ color: !isIncoming ? rowColor : 'inherit' }}>{item.fromLocation || 'Vendor'}</td>
                                    <td style={{ color: isIncoming ? rowColor : 'inherit' }}>{item.toLocation || 'Customer'}</td>
                                    <td style={{ fontWeight: 'bold' }}>{item.quantity}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px', 
                                            backgroundColor: item.status === 'Done' ? '#dcfce7' : '#fef3c7',
                                            color: item.status === 'Done' ? '#15803d' : '#92400e'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredHistory.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        No movement history found. Ensure backend is running.
                    </div>
                )}
            </div>
        </div>
    );
}