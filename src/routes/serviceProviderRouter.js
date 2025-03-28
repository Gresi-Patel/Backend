import express from 'express';
import { getServiceProvider } from '../controllers/serviceProviderController.js';
// import { serviceProviderController } from '../controllers/serviceProviderController';
const serviceProviderRouter=express.Router();

serviceProviderRouter.get('/',getServiceProvider)
// serviceProviderRouter.delete('/:id',serviceProviderController)
export {serviceProviderRouter};