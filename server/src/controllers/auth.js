const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpCode = require('../constants/httpCode');
const { sendVerificationEmail } = require('../utils/mailer');

require('dotenv').config();

const login = async (req, res) => {
    try {
        const username = req.body.username.toLowerCase().trim();
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(httpCode.BadRequest).json({
                message: 'User not found',
            });
        }
        if (!user.emailVerified) {
            return res.status(httpCode.BadRequest).json({
                message: 'Email not verified',
            });
        }
        const isPasswordMatch = await user.verify(req.body.password);
        if (!isPasswordMatch) {
            return res.status(httpCode.BadRequest).json({
                message: 'Invalid password',
            });
        }
        const token = generateToken(user._id);
        res.status(httpCode.OK).json({
            user,
            token,
        });


    } catch (error) {
        console.log("Error in login controller", error);
        res.status(httpCode.InternalServerError).json({
            message: 'Internal server error in login',
        });
    }
}

const register = async (req, res) => {
    try {
        const username = req.body.username.toLowerCase().trim();
        const email = req.body.email.toLowerCase().trim();
        const userExist = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (userExist) {
            return res.status(httpCode.BadRequest).json({
                message: 'User already exist',
            });
        }
        const emailToken = generateRandomToken(20);
        const user = await User.create({ ...req.body, emailToken });
        if (!user) {
            return res.status(httpCode.BadRequest).json({
                message: 'User not created',
            });
        }
        await sendVerificationEmail(user.email, emailToken);
        res.status(httpCode.Created).json({
            user,
            message: 'User created successfully',
        });

    } catch (error) {
        console.log("Error in register controller", error);
        res.status(httpCode.InternalServerError).json({
            message: 'Internal server error in register',
        });
    }
}

// api/auth/verify/:token
const verifyEmail = async (req, res) => {
    try {
        // console.log("token", req.params.token);
        const user = await User.findOne({ emailToken: req.params.token });
        if (!user) {
            return res.status(httpCode.BadRequest).json({
                message: 'Invalid Email verification token',
            });
        }
        user.emailVerified = true;

        await user.save();
        res.status(httpCode.OK).json({
            message: 'Email verified successfully',
        })
    } catch (error) {
        console.log(error);
        response.status(httpCode.InternalServerError).json({
            message: 'something went wrong',
        });
    }
}

function generateRandomToken(length = 20) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}

const generateToken = (id) => {
    // console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = {
    login,
    register,
    verifyEmail,
};