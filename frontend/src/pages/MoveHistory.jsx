import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, List, LayoutGrid } from 'lucide-react';
import styles from './MoveHistory.module.css';


export default function MoveHistory() {
    const [moves, setMoves] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    
    // NEW: Search state
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWarehousesAndMoves();
    }, []);

    const fetchWarehousesAndMoves = async () => {
        try {
            const whResponse = await axios.get('http://localhost:5000/api/warehouses');
            setWarehouses(whResponse.data);

            const opResponse = await axios.get('http://localhost:5000/api/operations');
            setMoves(opResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };

    const getLocationName = (locationString) => {
        if (!locationString) return '-';
        if (['Vendor', 'Customer', 'N/A'].includes(locationString)) return locationString;
        const foundWh = warehouses.find(wh => wh._id === locationString);
        return foundWh ? foundWh.name : locationString;
    };

    const getRowStyle = (type) => {
        if (type === 'Receipt') return styles.rowIn;
        if (type === 'Delivery') return styles.rowOut;
        return styles.rowNeutral;
    };

    const getContact = (type) => {
        if (type === 'Receipt') return 'Azure Interior (Vendor)';
        if (type === 'Delivery') return 'Retail Customer';
        return 'Internal Staff';
    };

    // --- NEW: FILTER LOGIC ---
    // This instantly filters the list based on Reference or Contact matching the search query
    const filteredMoves = moves.filter((move) => {
        const reference = (move.reference || 'SYS-GEN').toLowerCase();
        const contact = getContact(move.type).toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return reference.includes(query) || contact.includes(query);
    });

    // --- NEW: KANBAN COLUMN SETUP ---
    const kanbanStatuses = ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'];

    return (
        <div className={styles.pageContainer}>
            
            <div className={styles.topBar}>
                <div className={styles.leftControls}>
                    <button className={styles.newBtn}>NEW</button>
                    <h1 className={styles.pageTitle}>Move History</h1>
                </div>

                <div className={styles.rightControls}>
                    {/* NEW: Interactive Search Bar */}
                    <div className={styles.searchContainer}>
                        <Search size={16} color="#94a3b8" />
                        <input 
                            type="text" 
                            placeholder="Search Ref or Contact..." 
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button 
                        className={`${styles.iconBtn} ${viewMode === 'list' ? styles.activeIcon : ''}`} 
                        onClick={() => setViewMode('list')} title="List View"
                    >
                        <List size={20} />
                    </button>
                    <button 
                        className={`${styles.iconBtn} ${viewMode === 'grid' ? styles.activeIcon : ''}`} 
                        onClick={() => setViewMode('grid')} title="Board View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            {/* LIST VIEW */}
            {viewMode === 'list' ? (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Reference</th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Contact</th>
                                <th className={styles.th}>From</th>
                                <th className={styles.th}>To</th>
                                <th className={styles.th}>Quantity</th>
                                <th className={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMoves.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: '#94a3b8'}}>No matching records found.</td>
                                </tr>
                            ) : (
                                filteredMoves.map((move) => (
                                    <tr key={move._id} className={getRowStyle(move.type)}>
                                        <td className={styles.td}>{move.reference || 'SYS-GEN'}</td>
                                        <td className={styles.td}>{formatDate(move.createdAt)}</td>
                                        <td className={styles.td}>{getContact(move.type)}</td>
                                        <td className={styles.td}>{getLocationName(move.fromLocation)}</td>
                                        <td className={styles.td}>{getLocationName(move.toLocation)}</td>
                                        <td className={styles.td}>{move.product?.name} ({move.quantity})</td>
                                        <td className={styles.td}>{move.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* KANBAN BOARD VIEW */
                <div className={styles.kanbanContainer}>
                    {kanbanStatuses.map(status => {
                        // Filter the already-searched moves down to this specific column's status
                        const columnMoves = filteredMoves.filter(m => m.status === status);
                        
                        return (
                            <div key={status} className={styles.kanbanColumn}>
                                <div className={styles.kanbanHeader}>
                                    <span>{status}</span>
                                    <span className={styles.badgeCount}>{columnMoves.length}</span>
                                </div>
                                
                                {columnMoves.map(move => {
                                    // Apply border color based on in/out movement
                                    const cardStyle = move.type === 'Receipt' ? styles.cardIn : 
                                                      move.type === 'Delivery' ? styles.cardOut : '';
                                    return (
                                        <div key={move._id} className={`${styles.kanbanCard} ${cardStyle}`}>
                                            <div className={styles.cardRef}>{move.reference || 'SYS-GEN'}</div>
                                            <div className={styles.cardContact}>{getContact(move.type)}</div>
                                            <div className={styles.cardDetails}>
                                                <span style={{fontWeight: 600}}>{move.product?.name}</span>
                                                <span>Qty: {move.quantity}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}