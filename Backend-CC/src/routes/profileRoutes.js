import express from 'express';
import { getUserProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';
import { uploadSingle } from '../middleware/fileUpload.js';

const router = express.Router();

// Route untuk mendapatkan profil pengguna : userId, name, email, profile_picture_url
router.get('/', authenticate, getUserProfile);

// Route untuk mengupdate profil pengguna
router.post('/update', authenticate, uploadSingle, updateProfile, (error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

export default router;
