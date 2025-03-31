import express from 'express';
import { deleteUser, getAllServices, getAllUsers, getTotalStats } from '../controllers/adminController.js';
import {authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
const adminRouter=express.Router();

adminRouter.get("/users",authenticateToken,authorizeRole("admin"),getAllUsers);
adminRouter.get("/services",authenticateToken,authorizeRole("admin"),getAllServices);
adminRouter.delete("/users/:id",authenticateToken,authorizeRole("admin"),deleteUser);

adminRouter.get("/stats",getTotalStats)

export default adminRouter;