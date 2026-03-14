const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
};

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ user: { id: user._id, name, email }, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ user: { id: user._id, name: user.name, role: user.role }, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "This email is not registered." });
        }

        // 1. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000; 
        await user.save();

        // 2. Create Transporter inside the request to ensure .env is loaded
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. Attempt to send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP is ${otp}. It will expire in 15 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "OTP sent to your email!" });
        } catch (mailError) {
            // IF MAIL FAILS: We log the error but DON'T crash. 
            // We tell the user to check the terminal so you can keep working.
            console.error("Critical Nodemailer Error:", mailError.message);
            
            return res.status(200).json({ 
                message: "Email service busy. OTP generated in server terminal for testing.",
                devOtp: otp // Sending it back only for your testing convenience
            });
        }

    } catch (error) {
        console.error("General Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// New logic to verify OTP BEFORE showing password fields
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ 
            email, 
            resetOtp: otp, 
            otpExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });
        
        res.status(200).json({ message: "OTP Verified. Proceed to reset password." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};