const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression')
const cors = require('cors');
const ApiError = require('./utils/apiError');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const authRoute = require('./Route/authRoute');
const planRoute = require('./Route/planRoute');
const eventRoute = require('./Route/eventRoute');
const bookingRoute = require('./Route/bookingRoute');
const globalError = require('./Midlleware/globalError')
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// compress request
app.use(compression());

app.use('/api/auth', authRoute);
app.use('/api/plans', planRoute);
app.use('/api/events', eventRoute);
app.use('/api/bookings/', bookingRoute);



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// handle global error
app.use(globalError);


const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection at: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    })
})