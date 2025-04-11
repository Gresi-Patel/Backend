import express from 'express';
import { resetPassword, sendOtp, verifyOtp } from '../controllers/otpController.js';
const otpRouter = express.Router();

otpRouter.post('/send-otp', sendOtp);
otpRouter.post('/verify-otp', verifyOtp);
otpRouter.post('/reset-password', resetPassword);


export default otpRouter;