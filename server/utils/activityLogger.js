const Activity = require('../models/Activity');

const logActivity = async ({ project, task, user, action, details }) => {
    try {
        if (!project || !user || !action || !details) return;
        await Activity.create({
            project,
            task: task || null,
            user,
            action,
            details
        });
    } catch (err) {
        console.error('Failed to log activity:', err.message);
    }
};

module.exports = { logActivity };
