import express from 'express';
import { createSubType } from '../controllers/subTypeController.js';

const serviceSubtypeRouter=express.Router();

serviceSubtypeRouter.post('/', createSubType);

export {serviceSubtypeRouter};