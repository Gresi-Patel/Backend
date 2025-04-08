import express from 'express';
import { approveBooking, approveServiceProvider, deleteUser, getAllBookings, getAllServices, getAllUsers, getTotalStats, rejectBooking, rejectServiceProvider} from '../controllers/adminController.js';
import {authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
const adminRouter=express.Router();

adminRouter.get("/users",authenticateToken,authorizeRole("admin"),getAllUsers);
adminRouter.get("/services",authenticateToken,authorizeRole("admin"),getAllServices);
adminRouter.delete("/users/:id",authenticateToken,authorizeRole("admin"),deleteUser);
adminRouter.put("/approve-service-provider/:id",authenticateToken,authorizeRole("admin"),approveServiceProvider);
adminRouter.put("/reject-service-provider/:id",authenticateToken,authorizeRole("admin"),rejectServiceProvider);
adminRouter.get("/bookings",authenticateToken,authorizeRole("admin"),getAllBookings);
adminRouter.put("/approve-booking/:id",authenticateToken,authorizeRole("admin"),approveBooking);
adminRouter.put("/reject-booking/:id",authenticateToken,authorizeRole("admin"),rejectBooking);

adminRouter.get("/stats",getTotalStats)

export default adminRouter;