import express from 'express';
import {
    acceptedBooking,
    cancelledBooking,
    confirmedBooking,
    createBooking,
    deleteBooking,
    getAllBookings,
    rejectBooking,
    updateBookingStatus
}
    from '../controllers/bookingController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
const bookingRouter = express.Router();

bookingRouter.post("/", createBooking)
bookingRouter.put("/:id/status", updateBookingStatus)
bookingRouter.get("/", getAllBookings)
bookingRouter.delete("/:id", deleteBooking)
bookingRouter.put('/:id', acceptedBooking)
bookingRouter.put('/:id', rejectBooking)
bookingRouter.put('/:id', confirmedBooking)
bookingRouter.put('/:id', cancelledBooking)

export { bookingRouter };