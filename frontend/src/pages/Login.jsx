import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AuthLayout.module.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);
        
        if (response.data.token) {
            // 1. Store JWT and User data locally
            localStorage.setItem('token', response.data.token);
            // Note: In your Navbar you use 'inventoryUser', 
            // ensure this key matches what your Navbar expects!
            localStorage.setItem('inventoryUser', JSON.stringify(response.data.user));

            // 2. THE FIX: Trigger a global event so the Navbar updates 
            window.dispatchEvent(new Event("storage"));

            // 3. Navigate to dashboard
            navigate('/'); 
        }
    } catch (err) {
        setError(err.response?.data?.message || "Invalid Email or Password");
    }
};
    return (
        <div className={styles.authBackground}>
            <div className={styles.glassCard}>
                <header>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Inventory Management System</p>
                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </header>

                <form onSubmit={handleLogin} className="mt-6">
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            className={styles.inputField}
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div className="flex justify-between items-center mb-1">
                            <label className={styles.label}>Password</label>
                            <Link to="/forgot-password" className={styles.linkText}>Forgot password?</Link>
                        </div>
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
                        Sign In
                    </button>
                </form>

                <div className={styles.dividerContainer}>
                    <div className={styles.dividerLine}><span className={styles.line}></span></div>
                    <div className={styles.dividerTextWrapper}>
                        <span className={styles.dividerText}>Or continue with</span>
                    </div>
                </div>

                <div className={styles.socialGrid}>
                    <button type="button" className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className={styles.socialIcon} alt="Google" />
                        <span>Google</span>
                    </button>
                    <button type="button" className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/443329/brand-apple.svg" className={styles.socialIcon} alt="Apple" />
                        <span>Apple</span>
                    </button>
                </div>

                <p className={styles.footerText}>
                    Don't have an account?{' '}
                    <Link to="/signup" className={styles.linkText}>Create Account</Link>
                </p>
            </div>
        </div>
    );
}