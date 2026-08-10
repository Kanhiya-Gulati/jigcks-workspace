const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

const router = express.Router();

// PUBLIC UNPROTECTED TASK LIST FOR CLIENT LIVE PREVIEW
router.get('/public/project/:projectId', async (req, res) => {
    try {
        const Comment = require('../models/Comment');
        const mongoose = require('mongoose');

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email avatar')
            .sort({ createdAt: 1 });

        const commentCounts = await Comment.aggregate([
            { $match: { project: new mongoose.Types.ObjectId(req.params.projectId) } },
            { $group: { _id: '$task', count: { $sum: 1 } } }
        ]);

        const commentMap = {};
        commentCounts.forEach(c => {
            commentMap[c._id.toString()] = c.count;
        });

        const tasksWithCommentCount = tasks.map(t => {
            const doc = t.toObject();
            doc.commentCount = commentMap[t._id.toString()] || 0;
            return doc;
        });

        tasksWithCommentCount.sort((a, b) => 
            (a.taskNumber || '').localeCompare(b.taskNumber || '', undefined, { numeric: true, sensitivity: 'base' })
        );

        res.json({ success: true, data: tasksWithCommentCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.use(protect);

router.get('/project/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const assignedIds = project.assignedTo.map(id => id.toString());
        if (req.user.role !== 'admin' && !assignedIds.includes(req.user._id.toString())) {
            return res.status(403).json({ success: false, message: 'Not authorized to access tasks for this project' });
        }

        const Comment = require('../models/Comment');
        const mongoose = require('mongoose');

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email avatar')
            .sort({ createdAt: 1 });

        const commentCounts = await Comment.aggregate([
            { $match: { project: new mongoose.Types.ObjectId(req.params.projectId) } },
            { $group: { _id: '$task', count: { $sum: 1 } } }
        ]);

        const commentMap = {};
        commentCounts.forEach(c => {
            commentMap[c._id.toString()] = c.count;
        });

        const tasksWithCommentCount = tasks.map(t => {
            const doc = t.toObject();
            doc.commentCount = commentMap[t._id.toString()] || 0;
            return doc;
        });

        tasksWithCommentCount.sort((a, b) => 
            (a.taskNumber || '').localeCompare(b.taskNumber || '', undefined, { numeric: true, sensitivity: 'base' })
        );

        res.json({ success: true, data: tasksWithCommentCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', adminOnly, async (req, res) => {
    try {
        const task = await Task.create(req.body);
        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email avatar');

        await logActivity({
            project: task.project,
            task: task._id,
            user: req.user._id,
            action: 'task_created',
            details: `Created new Task #${task.taskNumber || ''} "${task.title}"`
        });

        res.status(201).json({ success: true, data: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', adminOnly, async (req, res) => {
    try {
        const oldTask = await Task.findById(req.params.id);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('assignedTo', 'name email avatar');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        let actionType = 'task_updated';
        let detailText = `Updated Task #${task.taskNumber || ''} "${task.title}"`;

        if (oldTask && oldTask.assignedTo?.toString() !== req.body.assignedTo?.toString()) {
            actionType = 'reassigned';
            detailText = task.assignedTo 
                ? `Reassigned Task #${task.taskNumber || ''} "${task.title}" to ${task.assignedTo.name}`
                : `Unassigned Task #${task.taskNumber || ''} "${task.title}"`;
        }

        await logActivity({
            project: task.project,
            task: task._id,
            user: req.user._id,
            action: actionType,
            details: detailText
        });

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (req.user.role !== 'admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task status' });
        }

        task.status = status;
        if (status === 'completed') {
            task.completedAt = Date.now();
        } else {
            task.completedAt = null;
        }

        await task.save();

        let readableStatus = 'PENDING';
        if (status === 'completed') readableStatus = 'DONE';
        else if (status === 'template-ready') readableStatus = 'TEMPLATE READY';

        await logActivity({
            project: task.project,
            task: task._id,
            user: req.user._id,
            action: 'status_change',
            details: `Marked Task #${task.taskNumber || ''} "${task.title}" as ${readableStatus}`
        });

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await logActivity({
            project: task.project,
            task: task._id,
            user: req.user._id,
            action: 'task_deleted',
            details: `Deleted Task #${task.taskNumber || ''} "${task.title}"`
        });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
