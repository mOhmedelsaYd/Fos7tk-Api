const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const Event = require('../Model/Event');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../Midlleware/uploadImageMiddleware');

exports.uploadEventImage = uploadSingleImage('ImageURL');

exports.imageProcessing = asyncHandler((req, res, next) => { // if we refactor we make multi arguments for this we don't refactoring this
    const filename = `event-${uuidv4()}-${Date.now()}.jpeg`
    sharp(req.file.buffer).resize(250, 250).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/events/${filename}`);
    req.body.ImageURL = filename;
    next();
})

// @desc create event
// @route POST /api/events/
// @access Protected/admin

exports.createEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.create(req.body);
    res.status(201).json({ message: 'Event created successfully' , data : event});
})

// @desc get list of all event
// @route GET /api/events/
// @access Public

exports.getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find();
    res.status(200).json({message: 'Events retrieved successfully', data: events})
})

// @desc update specific event
// @route PUT /api/events/:id
// @access Protected/admin

exports.updateEvent = asyncHandler(async(req, res, next) => {
    const id = req.params.id;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
        return next(new ApiError(`No Event found with the provided ID: ${id}`, 404));
    }

    res.status(200).json({ message: 'Event updated successfully', data: event });
})

exports.deleteEvent = asyncHandler(async (req, res, next) => {

    const id = req.params.id;
    const event = await Event.findByIdAndDelete(id, req.body);

    if (!event) {
        return next(new ApiError(`No Event found with the provided ID: ${id}`, 404));
    }

    res.status(200).json({ message: 'Event deleted successfully' });
    
})