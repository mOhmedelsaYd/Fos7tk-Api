const express = require("express");
const router = express.Router();
const { createCheckoutSession, webhookCheckout } = require("../Controller/bookingController");
const { protect, allowTo } = require('../Controller/authController');

router.use(protect, allowTo('user', 'admin'));

router.post("/create-checkout-session/:bookingType/:referenceId", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), webhookCheckout);

module.exports = router;
