const ApiError = require('../utils/apiError');
const handleJwtInvalidSignature = () => new ApiError('Invalid Token, Please Login Again .....', 401);
const handleJwtExpire = () => new ApiError('Expire Token, Please Login Again ....', 401);

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendForDev(err, res);
    } else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJwtExpire();
        sendForProd(err, res);
    }
}

const sendForDev = (err, res) => {
    return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
    })
}

const sendForProd = (err, res) => {
    return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
    })
}

module.exports = globalError;