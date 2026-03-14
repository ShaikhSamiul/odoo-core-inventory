// frontend/src/pages/Operations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
// Reusing the Products CSS module for consistency and clean UI!
import styles from './Products.module.css';

export default function Operations() {
    const [operations, setOperations] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state for logging a new operation
    const [formData, setFormData] = useState({
        type: 'Receipt',
        product: '',
        quantity: 1,
        fromLocation: 'Vendor',
        toLocation: 'Warehouse 1',
        status: 'Done',
        reference: ''
    });

    useEffect(() => {
        fetchOperations();
        fetchProducts(); // We need the product list for the dropdown
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
            // Set the default product in the dropdown to the first product available
            if (response.data.length > 0) {
                setFormData(prev => ({ ...prev, product: response.data[0]._id }));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the operation to the backend
            await axios.post('http://localhost:5000/api/operations', formData);
            
            fetchOperations(); // Refresh the ledger table
            setIsModalOpen(false); // Close the modal
            
            // Reset form
            setFormData({
                type: 'Receipt',
                product: products[0]?._id || '',
                quantity: 1,
                fromLocation: 'Vendor',
                toLocation: 'Warehouse 1',
                status: 'Done',
                reference: ''
            });
            
            alert("Operation logged and stock updated successfully!");
        } catch (error) {
            console.error("Error saving operation:", error);
            alert("Failed to save operation. Check console.");
        }
    };

    // Helper to format dates
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

            {/* Operations Ledger Table */}
            <div className={styles.tableContainer}>
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Reference</th>
                            <th>Product</th>
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
                                <td className="font-bold">{op.type === 'Delivery' ? '-' : '+'}{op.quantity}</td>
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

            {/* Add Operation Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                        <h2 className={styles.modalTitle}>Process Inventory Movement</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Operation Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange} className={styles.formInput}>
                                        <option value="Receipt">Incoming Receipt (Vendor)</option>
                                        <option value="Delivery">Outgoing Delivery (Customer)</option>
                                        <option value="Internal">Internal Transfer</option>
                                        <option value="Adjustment">Stock Adjustment</option>
                                    </select>
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className={styles.formInput}>
                                        <option value="Done">Done (Updates Stock Immediately)</option>
                                        <option value="Draft">Draft (No Stock Change)</option>
                                        <option value="Waiting">Waiting (No Stock Change)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Select Product</label>
                                <select name="product" value={formData.product} onChange={handleInputChange} className={styles.formInput} required>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} (Current Stock: {p.stock})</option>
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

                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>From Location</label>
                                    <input type="text" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} className={styles.formInput} />
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>To Location</label>
                                    <input type="text" name="toLocation" value={formData.toLocation} onChange={handleInputChange} className={styles.formInput} />
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