const Project = require('../models/project');
const Task = require('../models/task');
const Invite = require('../models/invite');
const httpCode = require('../constants/httpCode');
const { sendInviteMail } = require('../utils/mailer');

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('members').populate('managers createdby');
        return res.status(httpCode.OK).json({ project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getProjectsByuserId = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ members: req.params.id }, { managers: req.params.id }] }).populate('members').populate('managers createdby');
        console.log(projects);
        return res.status(httpCode.OK).json({ projects });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const createProject = async (req, res) => {
    try {
        // remmove duplicate labels
        let labels = req.body.labels ?? [];
        // let uniqueLabels = [...new Set(labels)]; this is working
        let uniqueLabels = [];
        let uniqueLabelsName = [];
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            if (!uniqueLabelsName.includes(label.name)) {
                uniqueLabels.push(label);
                uniqueLabelsName.push(label.name);
            }
        }

        req.body.labels = uniqueLabels;
        console.log(req.body.labels);
        let project = await Project.create(req.body);
        project = await Project.findById(project._id).populate('members').populate('managers createdby');
        return res.status(httpCode.Created).json({ project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (!project.managers.find(u => u._id.toString() == req.user._id.toString())) {
            return res.status(httpCode.Forbidden).json({ message: 'only managers are allowed to update this project' });
        }
        project.set(req.body);
        await project.save();
        return res.status(httpCode.OK).json({ project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (project.createdby.toString() != req.user._id.toString()) {
            return res.status(httpCode.Forbidden).json({ message: 'only Creator of Project are allowed to delete this project' });
        }
        await Task.deleteMany({ project: project._id });
        await project.deleteOne();
        return res.status(httpCode.OK).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const addMember = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (!project.managers.find(u => u._id.toString() == req.user._id.toString())) {
            return res.status(httpCode.Forbidden).json({ message: 'only managers are allowed to add members  this project' });
        }
        if (project.members.find(u => u._id.toString() == req.body.useId) || project.managers.find(u => u._id.toString() == req.body.useId)) {
            return res.status(httpCode.BadRequest).json({ message: 'User already exists in this project' });
        }
        let invite = await Invite.findOne({ project: project._id, user: req.body.useId });
        if (invite) {
            return res.status(httpCode.BadRequest).json({ message: 'User already invited to this project' });
        }
        invite = await (await Invite.create({
            project: project._id,
            user: req.body.userId,
            role: req.body.role ?? 'member'
        })).populate('user project');
        if (invite) {
            await sendInviteMail(invite.user.email, invite.project, invite.role);
        }
        project = await project.populate('members managers createdby');
        return res.json({ project });

    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const removeMemeber = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (!project.managers.find(u => u._id.toString() == req.user._id.toString()) && req.body.userId !== req.user._id.toString()) {
            return res.status(httpCode.Forbidden).json({ message: 'only managers are allowed to delete members  this project' });
        }
        if (req.body.useId == project.createdby.toString()) {
            return res.status(httpCode.BadRequest).json({ message: 'Creator of project cannot be removed' });
        }
        project = await Project.findByIdAndUpdate(req.params.id, { $pull: { members: req.body.userId, managers: req.body.userId } }, { new: true }).populate('members managers createdby');
        await Task.updateMany({ project: project._id, assignedTo: req.body.userId }, { assignedTo: null });
        return res.json({ project });

    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const makeManager = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (req.user._id.toString() != project.createdby?.toString()) {
            return res.status(httpCode.Forbidden).json({ message: 'only creator of project can make manager' });
        }
        // console.log(req.body.userId);
        project = await Project.findByIdAndUpdate(req.params.id, { $addToSet: { managers: req.body.userId }, $pull: { members: req.body.userId } }, { new: true }).populate('members managers createdby');
        return res.status(httpCode.OK).json({ project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const removedManager = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(httpCode.NotFound).json({ message: 'Project not found' });
        }
        if (req.user._id.toString() != project.createdby.toString()) {
            return res.status(httpCode.Forbidden).json({ message: 'only creator of project can remove manager' });
        }
        project = await Project.findByIdAndUpdate(req.params.id, { $pull: { managers: req.body.userId }, $addToSet: { members: req.body.userId } }, { new: true }).populate('members managers createdby');
        return res.status(httpCode.OK).json({ project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

module.exports = {
    getProjectById,
    getProjectsByuserId,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMemeber,
    makeManager,
    removedManager,
}