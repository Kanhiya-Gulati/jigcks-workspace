const express = require('express');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get recent activities for a project
router.get('/project/:projectId', protect, async (req, res) => {
    try {
        const activities = await Activity.find({ project: req.params.projectId })
            .populate('user', 'name username avatar role')
            .populate('task', 'taskNumber title')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
