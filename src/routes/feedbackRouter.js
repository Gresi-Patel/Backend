import express from 'express';
import { createFeedback, getFeedback } from '../controllers/feedbackController.js';
const feedbackRouter=express.Router();

feedbackRouter.post("/",createFeedback);
feedbackRouter.get("/",getFeedback);


export default feedbackRouter;