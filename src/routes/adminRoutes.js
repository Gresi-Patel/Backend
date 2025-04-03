import express from 'express';
import { approveServiceProvider, deleteUser, getAllServices, getAllUsers, getTotalStats, rejectServiceProvider} from '../controllers/adminController.js';
import {authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
const adminRouter=express.Router();

adminRouter.get("/users",authenticateToken,authorizeRole("admin"),getAllUsers);
adminRouter.get("/services",authenticateToken,authorizeRole("admin"),getAllServices);
adminRouter.delete("/users/:id",authenticateToken,authorizeRole("admin"),deleteUser);
adminRouter.put("/approve-service-provider/:id",authenticateToken,authorizeRole("admin"),approveServiceProvider);
adminRouter.put("/reject-service-provider/:id",authenticateToken,authorizeRole("admin"),rejectServiceProvider);

adminRouter.get("/stats",getTotalStats)

export default adminRouter;