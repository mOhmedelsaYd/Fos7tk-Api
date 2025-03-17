const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const apiError = require('../utils/apiError')
const generateToken = require('../utils/generateToken');
const { header } = require('express-validator');


exports.register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, userName, email, password, phone } = req.body;

    // Create User
    const user = await User.create({ firstName, lastName, userName, email, password, phone });

    // Generate Token
    const token = generateToken(user._id)

    res.status(201).json({
        data: {
            name: user.firstName + " " + user.lastName, email: user.email,
            userName: user.userName, imageURL: user.imageURL, phone: user.phone
        }, token
    });
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user | !(await bcrypt.compare(password, user.password))) {
        return next(new apiError('Invalid email or password', 401))
    }

    const token = generateToken(user._id);

    res.status(200).json({
        data: {
            name: user.firstName + " " + user.lastName, email: user.email,
            userName: user.userName, imageURL: user.imageURL, role: user.role, phone: user.phone
        }, token});
})

exports.logout = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        message: "User logged out successfully",
        token: null
    });
});

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new apiError('You are not login, Please login to get access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
        return next(new apiError('the user that belong to this token no longer exist', 401));
    }

    req.user = currentUser;
    next();
})

exports.allowTo = (...roles) => 
    asyncHandler(async (req, res, next) => {
        if (!(roles.includes(req.user.role))) {
            return next(new apiError('You do not have permission to perform this action', 403))
        }

        next();
})