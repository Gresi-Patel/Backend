import express from 'express';
import { createService, deleteService, getAllServices, getServiceById } from '../controllers/serviceController.js';
// import {  authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
const serviceRouter=express.Router();

serviceRouter.post("/",createService)
serviceRouter.get("/",getAllServices)
serviceRouter.get("/:id",getServiceById)
serviceRouter.delete("/:id",deleteService)

export {serviceRouter};