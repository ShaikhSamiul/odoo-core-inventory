import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AuthLayout.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Request, 2: Verify OTP, 3: Reset Password
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // This was causing the error
    const navigate = useNavigate();

    // STEP 1: Request the OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message); // Setting the value
            setStep(2); 
        } catch (err) {
            setError(err.response?.data?.message || "User not found with this email.");
        }
    };

    // STEP 2: Verify the OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            setMessage("OTP Verified! Please set your new password.");
            setStep(3); 
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP.");
        }
    };

    // STEP 3: Reset the Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
            alert("Success! Password has been updated.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className={styles.authBackground}>
            <div className={styles.glassCard}>
                <header>
                    <h1 className={styles.title}>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify Code"}
                        {step === 3 && "New Password"}
                    </h1>
                    <p className={styles.subtitle}>
                        {step === 1 && "Enter your email to receive a 6-digit code"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Set your new secure password"}
                    </p>

                    {/* FIX: Displaying the message so the error disappears */}
                    {message && (
                        <p className="text-green-600 text-sm text-center mt-3 font-medium bg-green-50 p-2 rounded border border-green-100">
                            {message}
                        </p>
                    )}
                    
                    {error && (
                        <p className="text-red-500 text-sm text-center mt-3 font-medium bg-red-50 p-2 rounded border border-red-100">
                            {error}
                        </p>
                    )}
                </header>

                <form onSubmit={step === 1 ? handleRequestOTP : step === 2 ? handleVerifyOTP : handleResetPassword} className="mt-6">
                    {step === 1 && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                className={styles.inputField}
                                placeholder="registered@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>6-Digit OTP</label>
                            <input 
                                type="text" 
                                className={styles.inputField}
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required 
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                className={styles.inputField}
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required 
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn}>
                        {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Update Password"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className={styles.linkText}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}