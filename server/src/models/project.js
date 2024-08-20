const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    repo: {
        type: String,
        required: true
    },

    // add list of object which contain label name and random  color
    labels: [{
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            required: true
        }
    }],

    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    managers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    createdby: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;