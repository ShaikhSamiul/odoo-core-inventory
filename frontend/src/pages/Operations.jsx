// frontend/src/pages/Operations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import styles from './Products.module.css';

export default function Operations() {
    const [operations, setOperations] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]); // NEW: State for Warehouses
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        type: 'Receipt',
        product: '',
        quantity: 1,
        fromLocation: 'Vendor',
        toLocation: '', // Will map to a Warehouse ID
        status: 'Done',
        reference: ''
    });

    useEffect(() => {
        fetchOperations();
        fetchProducts();
        fetchWarehouses(); // NEW: Fetch warehouses on load
    }, []);

    const fetchOperations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/operations');
            setOperations(response.data);
        } catch (error) {
            console.error("Error fetching operations:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            if (response.data.length > 0) {
                setFormData(prev => ({ ...prev, product: response.data[0]._id }));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // NEW: Fetch Warehouses
    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/warehouses');
            setWarehouses(response.data);
            if (response.data.length > 0) {
                setFormData(prev => ({ ...prev, toLocation: response.data[0]._id }));
            }
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
    };

    // Dynamically handle form changes to reset From/To fields based on type
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        const defaultWh = warehouses.length > 0 ? warehouses[0]._id : '';
        
        let from = '';
        let to = '';

        if (newType === 'Receipt') { from = 'Vendor'; to = defaultWh; }
        else if (newType === 'Delivery') { from = defaultWh; to = 'Customer'; }
        else if (newType === 'Internal') { from = defaultWh; to = defaultWh; }
        else if (newType === 'Adjustment') { from = defaultWh; to = 'N/A'; }

        setFormData({ ...formData, type: newType, fromLocation: from, toLocation: to });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/operations', formData);
            fetchOperations();
            fetchProducts(); // Refresh products to show updated stock!
            setIsModalOpen(false);
            
            setFormData({
                type: 'Receipt',
                product: products[0]?._id || '',
                quantity: 1,
                fromLocation: 'Vendor',
                toLocation: warehouses[0]?._id || '',
                status: 'Done',
                reference: ''
            });
            
            alert("Operation logged successfully!");
        } catch (error) {
            console.error("Error saving operation:", error);
            alert(error.response?.data?.message || "Failed to save operation.");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Inventory Ledger (Operations)</h1>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Log New Operation
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Reference</th>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Qty</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((op) => (
                            <tr key={op._id}>
                                <td className="text-sm text-gray-500">{formatDate(op.createdAt)}</td>
                                <td className="font-semibold text-gray-700">{op.type}</td>
                                <td>{op.reference || '-'}</td>
                                <td className="text-blue-600 font-medium">{op.product?.name}</td>
                                <td className="text-gray-600">{op.product?.warehouse?.name || 'Unknown'}</td>
                                <td className="font-bold">{op.type === 'Delivery' || op.type === 'Adjustment' && op.quantity < 0 ? '-' : '+'}{Math.abs(op.quantity)}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${op.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {op.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                        <h2 className={styles.modalTitle}>Process Inventory Movement</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Operation Type</label>
                                    <select name="type" value={formData.type} onChange={handleTypeChange} className={styles.formInput}>
                                        <option value="Receipt">Incoming Receipt (Vendor)</option>
                                        <option value="Delivery">Outgoing Delivery (Customer)</option>
                                        <option value="Internal">Internal Transfer</option>
                                        <option value="Adjustment">Stock Adjustment</option>
                                    </select>
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className={styles.formInput}>
                                        <option value="Done">Done (Updates Stock)</option>
                                        <option value="Draft">Draft (No Change)</option>
                                        <option value="Waiting">Waiting (No Change)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Select Product</label>
                                <select name="product" value={formData.product} onChange={handleInputChange} className={styles.formInput} required>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} — Stock: {p.stock} ({p.warehouse?.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className={styles.formInput} required min="1" />
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Reference / Order ID</label>
                                    <input type="text" name="reference" value={formData.reference} onChange={handleInputChange} className={styles.formInput} placeholder="e.g. PO-9923" />
                                </div>
                            </div>

                            {/* DYNAMIC FROM/TO LOCATIONS */}
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>From Location</label>
                                    {formData.type === 'Receipt' ? (
                                        <input type="text" value="Vendor" readOnly className={styles.formInput} style={{backgroundColor: '#f1f5f9', color: '#64748b'}} />
                                    ) : (
                                        <select name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} className={styles.formInput} required>
                                            <option value="" disabled>Select Warehouse...</option>
                                            {warehouses.map(wh => <option key={wh._id} value={wh._id}>{wh.name}</option>)}
                                        </select>
                                    )}
                                </div>
                                
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>To Location</label>
                                    {formData.type === 'Delivery' ? (
                                        <input type="text" value="Customer" readOnly className={styles.formInput} style={{backgroundColor: '#f1f5f9', color: '#64748b'}} />
                                    ) : formData.type === 'Adjustment' ? (
                                        <input type="text" value="N/A" readOnly className={styles.formInput} style={{backgroundColor: '#f1f5f9', color: '#64748b'}} />
                                    ) : (
                                        <select name="toLocation" value={formData.toLocation} onChange={handleInputChange} className={styles.formInput} required>
                                            <option value="" disabled>Select Warehouse...</option>
                                            {warehouses.map(wh => <option key={wh._id} value={wh._id}>{wh.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.addButton}>Process Operation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}