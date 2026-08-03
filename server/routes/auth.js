const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const query = (username || email || '').toLowerCase().trim();

        const user = await User.findOne({
            $or: [{ username: query }, { email: query }]
        });

        if (user && (await user.matchPassword(password))) {
            const sessionToken = crypto.randomUUID();
            user.sessionToken = sessionToken;
            await user.save();

            const token = jwt.sign(
                { id: user._id, sessionToken }, 
                process.env.JWT_SECRET, 
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isFirstLogin: user.isFirstLogin,
                        avatar: user.avatar,
                    }
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/logout', protect, async (req, res) => {
    try {
        if (req.user) {
            req.user.sessionToken = null;
            await req.user.save();
        }
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/change-password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both old and new password' });
        }

        const user = await User.findById(req.user._id);
        
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        user.isFirstLogin = false;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                isFirstLogin: false,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        res.json({ success: true, data: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
