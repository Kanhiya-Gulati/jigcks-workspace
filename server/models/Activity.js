const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    task: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['status_change', 'reassigned', 'task_created', 'task_updated', 'task_deleted', 'project_updated'],
        required: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Activity', activitySchema);
