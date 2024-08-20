const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        console.log("headers :", req.headers.authorization);
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // console.log("token:", token);
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id);
            // console.log("auth middleware", request.user);
            console.log("Authenticated");
            next();
        } else {
            console.log("unauthenticated");
            res.status(401).json({
                message: "you are not authorized"
            })
        }
    } catch (error) {
        res.status(401).json({
            message: "you are not middleware authorized!",
        });
    }
}