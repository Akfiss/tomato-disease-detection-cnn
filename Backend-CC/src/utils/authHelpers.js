import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const createTokenSendResponse = (user, profile, res) => {
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
        message: "Authentication successful",
        token,
        user: {
            user_id: user.user_id,
            email: user.email,
            name: profile.name,
            profile_picture_url: profile.profile_picture_url || 'https://storage.googleapis.com/tomguard/profile-picture/default.png'
        }
    });
};

export const refreshTokenIfNeeded = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.exp < Date.now() / 1000 + 15 * 24 * 3600) {
                const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '30d' });
                res.json({ newToken }); // Kirim token baru jika diperlukan
            }
        } catch (error) {
            console.log('Token expired or invalid:', error.message);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
    next();
};

export const destroyTokenSendResponse = (res) => {
    res.status(200).json({ message: "Logout successful" });
};