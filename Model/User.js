const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must be at least 6 characters'],
    },
    phone: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    imageURL: {
        type: String,
        default: 'https://www.gravatar.com/avatar/?d=mp',
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, +process.env.SALT);
    next();
})

module.exports = mongoose.model('User', userSchema);