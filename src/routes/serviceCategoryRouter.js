import express from 'express';
import { createServiceCategory } from '../controllers/serviceCategoryController.js';
const serviceCategoryRouter = express.Router();

serviceCategoryRouter.post("/",createServiceCategory)

export default serviceCategoryRouter;