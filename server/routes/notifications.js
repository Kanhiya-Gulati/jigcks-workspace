const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Get all notifications for current user
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name username avatar role')
            .populate('task', 'taskNumber title')
            .sort({ createdAt: -1 })
            .limit(30);

        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user._id, 
            isRead: false 
        });

        res.json({ 
            success: true, 
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark all notifications as read for current user
router.put('/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Clear all notifications for current user
router.delete('/clear-all', async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });
        res.json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete single notification
router.delete('/:id', async (req, res) => {
    try {
        await Notification.deleteOne({ _id: req.params.id, recipient: req.user._id });
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
