import express from 'express';
import { createEvent, deleteEvent, getEvent, getEventById } from '../controllers/eventController.js';
const eventRouter=express.Router();

eventRouter.post("/",createEvent);
eventRouter.get("/", getEvent);
eventRouter.get("/:id",getEventById)
eventRouter.delete("/:id",deleteEvent)

export {eventRouter};


