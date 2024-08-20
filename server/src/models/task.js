const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        null: true
    },
    labels: [{
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['TODO', 'In Progress', 'Completed'],
        default: 'TODO'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;