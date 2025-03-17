const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../Controller/authController');
const validator = require('../utils/validators/authValidtor');


router.post('/login', validator.loginValidator ,login);
router.post('/logout', logout);
router.post('/register', validator.signupValidator, register);


module.exports = router;

