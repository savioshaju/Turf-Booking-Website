const express = require('express');
const authUser = require('../middlewares/authUser.js');
const {createBooking,getAllBookings,deleteBooking,getFreeSlots} = require('../controllers/bookingController.js');

const bookingRouter = express.Router();

bookingRouter.post('/free-slots/:turfId', getFreeSlots);
// Create a new booking
bookingRouter.post('/create', authUser, createBooking);
// Cancel a booking by ID
bookingRouter.delete('/cancel/:id', authUser, deleteBooking);
// Get all bookings of the logged-in user
bookingRouter.get('/my-bookings', authUser, getAllBookings);


module.exports = bookingRouter;
