import express from 'express';
import { createBooking, deleteBooking, getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';
const bookingRouter = express.Router();

bookingRouter.post("/", createBooking)
bookingRouter.put("/:id/status", updateBookingStatus)
bookingRouter.get("/",getAllBookings)
bookingRouter.delete("/:id", deleteBooking)

export { bookingRouter };