const asyncHandler = require('express-async-handler');
const Plan = require('../Model/Plan');
const ApiError = require('../utils/apiError');


// @desc create plan
// @route POST /api/plans/
// @access Protected/admin

exports.createPlan = asyncHandler(async (req, res, next) => {
    const plan = await Plan.create(req.body);
    res.status(201).json({ message: 'Plan created successfully' , data : plan});
})

// @desc get list of all plan
// @route GET /api/plans/
// @access Public

exports.getPlans = asyncHandler(async (req, res, next) => {
    const plans = await Plan.find();
    res.status(200).json({message: 'Plans retrieved successfully', data: plans})
})

// @desc update specific plan
// @route PUT /api/plans/:id
// @access Protected/admin

exports.updatePlan = asyncHandler(async(req, res, next) => {
    const id = req.params.id;
    const plan = await Plan.findByIdAndUpdate(id, req.body, { new: true });

    if (!plan) {
        return next(new ApiError(`No plan found with the provided ID: ${id}`, 404));
    }

    res.status(200).json({ message: 'Plan updated successfully', data: plan });
})