const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
    try {
        let query = {};
        
        if (req.user.role === 'freelancer') {
            query.assignedTo = req.user._id;
        }

        const projects = await Project.find(query)
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .lean();

        for (let i = 0; i < projects.length; i++) {
            const tasks = await Task.find({ project: projects[i]._id });
            projects[i].taskCount = tasks.length;
            projects[i].completedTaskCount = tasks.filter(t => t.status === 'completed').length;
        }

        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const assignedIds = project.assignedTo.map(u => u._id.toString());
        if (req.user.role !== 'admin' && !assignedIds.includes(req.user._id.toString())) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
        }

        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', adminOnly, async (req, res) => {
    try {
        const { title, description, client, deadline, assignDate, assignedTo } = req.body;
        
        const project = await Project.create({
            title,
            description,
            client,
            deadline,
            assignDate,
            assignedTo,
            createdBy: req.user._id
        });

        const populatedProject = await Project.findById(project._id)
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name');

        res.status(201).json({ success: true, data: populatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', adminOnly, async (req, res) => {
    try {
        let project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        project = await Project.findById(project._id)
            .populate('assignedTo', 'name email avatar')
            .populate('createdBy', 'name');

        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);
        await Task.deleteMany({ project: req.params.id });

        res.json({ success: true, message: 'Project and associated tasks removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
