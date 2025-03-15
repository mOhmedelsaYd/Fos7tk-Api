const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
const apiError = require('../utils/apiError')
const generateToken = require('../utils/generateToken');


exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    // Create User
    const user = await User.create({ name, email, password, phone });

    // Generate Token
    const token = generateToken(user._id)

    res.status(201).json({ data: { name: user.name, email: user.email , phone :user.phone }, token });
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user | !(await bcrypt.compare(password, user.password))) {
        return next(new apiError('Invalid email or password', 401))
    }

    const token = generateToken(user._id);

    res.status(200).json({ data: { name: user.name, email: user.email , phone :user.phone }, token});
})