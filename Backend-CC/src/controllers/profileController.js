import { bucket } from '../config/storage.config.js';
import { User, Profile } from '../models/associations.js';
import bcrypt from 'bcryptjs';

const handleDbError = (error, res) => {
    console.error('Database error:', error);
    return res.status(500).json({ message: "Internal server error" });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findOne({
            where: { user_id: userId },
            attributes: ['user_id', 'email'],
            include: [{
                model: Profile,
                attributes: ['name', 'profile_picture_url']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const profile = user.profile;

        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        const userProfile = {
            user_id: user.user_id,
            email: user.email,
            name: profile.name,
            profile_picture_url: profile.profile_picture_url || 'https://storage.googleapis.com/tomguard/profile-picture/default.png'
        };

        res.status(200).json(userProfile);
    } catch (error) {
        handleDbError(error, res);
    }
};

export const updateProfile = async (req, res) => {
    const { newName, oldPassword, newPassword } = req.body;
    const { userId } = req.user;
    const file = req.file;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        const updateData = {};

        if (newName) {
            updateData.name = newName;
        }

        if (oldPassword && newPassword) {
            const validPassword = await bcrypt.compare(oldPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Invalid old password." });
            }

            if (oldPassword === newPassword) {
                return res.status(400).json({ message: "New password must be different from the old password." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.update({ password: hashedPassword }, { where: { user_id: userId } });
        }

        if (file) {
            const folder = 'profile-picture';
            const newFileName = `${folder}/${userId}-${Date.now()}-${file.originalname}`;
            const newBlob = bucket.file(newFileName);
            const currentPictureUrl = profile.profile_picture_url;
            const currentFileName = currentPictureUrl?.split('/').pop();

            if (currentPictureUrl && !currentPictureUrl.includes('default.png')) {
                const oldBlob = bucket.file(`${folder}/${currentFileName}`);
                await oldBlob.delete();
            }

            const blobStream = newBlob.createWriteStream({ resumable: false });
            blobStream.on('error', err => res.status(500).json({ message: err.message }));
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newBlob.name}`;
                updateData.profile_picture_url = publicUrl;
                await Profile.update(updateData, { where: { user_id: userId } });
                res.status(200).json({
                    message: "Profile updated successfully.",
                    name: newName,
                    url: publicUrl
                });
            });
            blobStream.end(file.buffer);
        } else {
            await Profile.update(updateData, { where: { user_id: userId } });
            res.status(200).json({ message: "Profile updated successfully.", name: newName });
        }
    } catch (error) {
        handleDbError(error, res);
    }
};