const express = require('express');
const router = express.Router();
const { protect, allowTo } = require('../Controller/authController');
const { uploadEventImage, imageProcessing, createEvent, getEvents, updateEvent, deleteEvent } = require('../Controller/eventController');

router.route('/')
    .get(getEvents)
    .post(protect, allowTo('admin'), uploadEventImage, imageProcessing, createEvent);

router.route('/:id')
    .put(protect, allowTo('admin'), updateEvent)
    .delete(protect, allowTo('admin'), deleteEvent);

module.exports = router;