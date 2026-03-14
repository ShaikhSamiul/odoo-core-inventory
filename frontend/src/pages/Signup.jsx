//Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AuthLayout.module.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Staff'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className={styles.authBackground}>
            <div className={styles.glassCard}>
                <header>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join Core Inventory</p>
                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </header>

                <form onSubmit={handleSignup} className="mt-6">
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input 
                            name="name"
                            type="text" 
                            className={styles.inputField}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            className={styles.inputField}
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Role</label>
                        <select 
                            name="role"
                            className={styles.inputField}
                            onChange={handleChange}
                            value={formData.role}
                        >
                            <option value="Staff">Staff</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input 
                            name="password"
                            type="password" 
                            className={styles.inputField}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Register
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account?{' '}
                    <Link to="/login" className={styles.linkText}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}