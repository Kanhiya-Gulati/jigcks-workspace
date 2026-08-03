const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskNumber: { type: String, default: '' },
    section: { type: String, default: '' },
    phase: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    componentFile: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'template-ready'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
