// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import styles from './Products.module.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', sku: '', category: 'Laptops', uom: 'Pcs', stock: 0, lowStockThreshold: 10, location: 'Warehouse 1'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
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
            await axios.post('http://localhost:5000/api/products', formData);
            fetchProducts();
            setIsModalOpen(false);
            setFormData({ name: '', sku: '', category: 'Laptops', uom: 'Pcs', stock: 0, lowStockThreshold: 10, location: 'Warehouse 1' });
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Electronics Inventory</h1>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add New Product
                </button>
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
                                        {product.location}
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

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}> {/* Widened slightly for 3 columns */}
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

                            {/* THE FIX: 3 Columns for Warehouse, Stock, and Low Stock Alert */}
                            <div className="flex gap-4 mb-4">
                                <div className={`${styles.formGroup} flex-1 mb-0`}>
                                    <label>Warehouse</label>
                                    <select name="location" value={formData.location} onChange={handleInputChange} className={styles.formInput}>
                                        <option value="Warehouse 1">Warehouse 1</option>
                                        <option value="Warehouse 2">Warehouse 2</option>
                                        <option value="Warehouse 3">Warehouse 3</option>
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