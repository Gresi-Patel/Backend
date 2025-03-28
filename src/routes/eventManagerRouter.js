import express from 'express';
import { getEvenetManager } from '../controllers/evenetManagerController.js';
const eventManagerRouter=express.Router();

eventManagerRouter.get("/",getEvenetManager)
export {eventManagerRouter};