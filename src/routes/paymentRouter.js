import express from 'express';
import { storePaymentDetails } from '../controllers/paymentController.js';
const paymentRouter = express.Router();


paymentRouter.post('/',storePaymentDetails)











export default paymentRouter;