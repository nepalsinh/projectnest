const User = require('../models/user');
const httpCode = require('../constants/httpCode');

const searchUsers = async (req, res) => {
    try {
        if (!req.query.username) {
            // No username provided in the query, retrieve all users without passwords
            const users = await User.find().select('-password');
            return res.status(httpCode.OK).json({ users: users });
        } else {
            // Username provided, search for users matching the username
            const users = await User.find({ username: { $regex: req.query.username, $options: 'i' } }).select('-password');
            return res.status(httpCode.OK).json({ users: users });
        }
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username }).select('-password');
        if (user) {
            return res.status(httpCode.OK).json({ user: user });
        }
        return res.status(httpCode.NotFound).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        if (req.params.id != req.user._id.toString()) {
            return res.status(httpCode.BadRequest).json({ message: 'You are not authorized to update this user' });
        }
        const id = req.params.id;
        const { username, email, password } = req.body;
        const user = await User.findByIdAndUpdate({ _id: id }, { username, email, password }, { new: true });
        if (user) {
            return res.status(httpCode.OK).json({ user: user });
        }
        return res.status(httpCode.NotFound).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.params.id != req.user._id.toString()) {
            return res.status(httpCode.BadRequest).json({ message: 'You are not authorized to delete this user' });
        }
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
            return res.status(httpCode.OK).json({ message: 'User deleted successfully' });
        }
        return res.status(httpCode.NotFound).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

module.exports = {
    searchUsers,
    getUserByUsername,
    updateUser,
    deleteUser,
}