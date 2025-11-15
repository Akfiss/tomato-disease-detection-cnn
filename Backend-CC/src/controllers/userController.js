import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import transporter from '../config/nodemailer.config.js';
import { createTokenSendResponse, destroyTokenSendResponse } from '../utils/authHelpers.js';
import { User, PasswordReset, Profile } from '../models/associations.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleDbError = (error, res) => {
    console.error('Database error:', error);
    return res.status(500).json({ message: "Internal server error" });
};

// Register new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            user_id: uuidv4(),
            email,
            password: hashedPassword
        });

        // Create associated profile
        await Profile.create({
            profile_id: uuidv4(),
            user_id: user.user_id,
            name
        });

        res.status(201).json({ message: "User registered successfully", userId: user.user_id });
    } catch (error) {
        handleDbError(error, res);
    }
};

// User login
export const loginUser = async (req, res) => {
    res.clearCookie('token');

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const profile = await Profile.findOne({ where: { user_id: user.user_id } });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        createTokenSendResponse(user, profile, res);
    } catch (error) {
        handleDbError(error, res);
    }
};

// User logout
export const logoutUser = (req, res) => {
    destroyTokenSendResponse(res);
};
    
// Request password reset
export const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        const otp = crypto.randomInt(100000, 999999).toString();  // Generate a 6-digit OTP
        const expireTime = new Date(Date.now() + 3600000);  // OTP valid for 1 hour

        await PasswordReset.create({
            reset_id: uuidv4(),
            user_id: user.user_id,
            token: otp,
            token_expires: expireTime
        });

        const mailOptions = {
            from: '"TomGuard Support" <support@tomguard.com>',
            to: email,
            subject: 'Your Password Reset Code',
            html: `
              <h1>Password Reset Request</h1>
              <p>You requested a password reset for your TomGuard account.</p>
              <p>Here is your OTP: <strong>${otp}</strong></p>
              <p>This code will expire in 1 hour.</p>
              <p>If you did not request this, please ignore this email or contact support if you have any concerns.</p>
            `
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'An email with your password reset code has been sent.' });
        });
    } catch (error) {
        handleDbError(error, res);
    }
};
  
// Reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({
            where: { email },
            include: [{
                model: PasswordReset,
                where: { token: otp, token_expires: { [Op.gt]: new Date() } }
            }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.update({ password: hashedPassword }, { where: { user_id: user.user_id } });

        await PasswordReset.destroy({ where: { user_id: user.user_id } });

        res.status(200).json({ message: "Your password has been successfully reset" });
    } catch (error) {
        handleDbError(error, res);
    }
};