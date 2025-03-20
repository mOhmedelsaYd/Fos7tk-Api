const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../Controller/bookingController");
const { protect, allowTo } = require('../Controller/authController');

router.use(protect, allowTo('user', 'admin'));
router.post("/create-checkout-session/:bookingType/:referenceId", createCheckoutSession);

module.exports = router;
