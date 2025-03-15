const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const connectDB = asyncHandler(async () => {
    mongoose.connect(process.env.DB_URL)
        .then((conn) => console.log(`MongoDB Connected Successfully At Host : ${conn.connection.host}`));
})

module.exports = connectDB;