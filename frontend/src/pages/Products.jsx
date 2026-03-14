import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Download } from 'lucide-react';
import styles from './Products.module.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', sku: '', category: 'Laptops', uom: 'Pcs', stock: 0, lowStockThreshold: 10, warehouse: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/warehouses');
            setWarehouses(response.data);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
    };

    // --- CSV DOWNLOAD LOGIC ---
    const downloadCSV = () => {
        if (!products || products.length === 0) {
            alert("No data available to download");
            return;
        }

        const headers = ["Product Name", "SKU", "Category", "Warehouse", "Stock Level", "UOM", "Threshold"];
        
        const rows = products.map(p => [
            `"${p.name}"`,
            `"${p.sku}"`,
            `"${p.category}"`,
            `"${p.warehouse?.name || 'Unassigned'}"`,
            p.stock,
            `"${p.uom}"`,
            p.lowStockThreshold
        ].join(","));

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Stock_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', formData);
            fetchProducts();
            setIsModalOpen(false);
            setFormData({ name: '', sku: '', category: 'Laptops', uom: 'Pcs', stock: 0, lowStockThreshold: 10, warehouse: '' });
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Electronics Inventory</h1>
                <div className="flex gap-3">
                    <button className={styles.cancelBtn} onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc' }}>
                        <Download size={18} /> Export CSV
                    </button>
                    <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} /> Add New Product
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Warehouse</th>
                            <th>Stock Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="font-medium">{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.category}</td>
                                <td>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                        {product.warehouse?.name || 'Unassigned'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.stockBadge} ${product.stock <= product.lowStockThreshold ? styles.stockLow : styles.stockNormal}`}>
                                        {product.stock} {product.uom}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal code remains exactly the same as provided in your prompt */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                        <h2 className={styles.modalTitle}>Add Electronics Item</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.formInput} required placeholder="e.g. iPad Pro 12.9" />
                            </div>
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>SKU / Code</label>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className={styles.formInput} required placeholder="TAB-APP-012" />
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className={styles.formInput}>
                                        <option value="Laptops">Laptops</option>
                                        <option value="Smartphones">Smartphones</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Displays">Displays</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Warehouse</label>
                                    <select name="warehouse" value={formData.warehouse} onChange={handleInputChange} className={styles.formInput} required>
                                        <option value="" disabled>Select a Warehouse...</option>
                                        {warehouses.map((wh) => (
                                            <option key={wh._id} value={wh._id}>{wh.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Current Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={styles.formInput} required min="0" />
                                </div>
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Low Stock Alert</label>
                                    <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleInputChange} className={styles.formInput} required min="0" />
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.addButton}>Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}