const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const avatarColors = ['#6C5CE7', '#00B894', '#0984E3', '#D63031', '#FDCB6E', '#E84393', '#6C5CE7', '#00CEC9'];

router.use(protect);
router.use(adminOnly);

router.get('/', async (req, res) => {
    try {
        const users = await User.find({ role: 'freelancer' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        
        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: 'Name, username, and password are required' });
        }

        const cleanUsername = username.toLowerCase().trim();

        const existingUser = await User.findOne({ username: cleanUsername });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
        
        const user = await User.create({
            name,
            username: cleanUsername,
            email: `${cleanUsername}@jigcks.com`,
            password,
            role: role || 'freelancer',
            isFirstLogin: true,
            avatar: randomColor
        });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.trim().length < 4) {
            return res.status(400).json({ success: false, message: 'Please provide a valid temporary password' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.password = newPassword;
        user.isFirstLogin = true; // Force password change popup on next login
        await user.save();

        res.json({
            success: true,
            message: `Password reset for ${user.name}. They will be prompted to set a new password on their next login.`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }

        await User.findByIdAndDelete(req.params.id);
        await Task.updateMany({ assignedTo: req.params.id }, { assignedTo: null });

        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
