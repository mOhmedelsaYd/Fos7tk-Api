const express = require('express');
const router = express.Router();
const { protect, allowTo } = require('../Controller/authController');
const { createPlan, getPlans, updatePlan } = require('../Controller/planController');

router.route('/').get(getPlans).post(protect, allowTo('admin'), createPlan);
router.route('/:id').put(protect, allowTo('admin'), updatePlan);

module.exports = router;