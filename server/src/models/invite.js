const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inviteSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
        enum: ['manager', 'member'],
        default: 'member',
    },
}, { timestamps: true });

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;