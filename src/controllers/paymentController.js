import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();

export const storePaymentDetails = async (req, res) => {
    const { transactionId, amount, bookingId } = req.body;
    // console.log(req.body)

    try {
        // Fetch transaction data from Razorpay API
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');

        const razorpayResponse = await axios.post(
            `https://api.razorpay.com/v1/payments/${transactionId}/capture`,
            {
                amount: amount * 100, 
                currency: 'INR',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        const transactionData = razorpayResponse.data;

        // console.log({
        //             transactionId: transactionData.id,
        //             amount: transactionData.amount,
        //             currency: transactionData.currency,
        //             status: transactionData.status,
        //             method: transactionData.method,
        //         })

        // Store payment details in the database
        const storedPayment = await prisma.payment.create({
            data: {
                transactionId: transactionData.id,
                amount: transactionData.amount,
                currency: transactionData.currency,
                status: transactionData.status,
                method: transactionData.method,
                bookingId: bookingId,
            },
        });

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' },
        });

        res.status(201).json({ success: true, message: 'Payment details stored successfully', payment: storedPayment });
    } 
    catch (error) {
        console.error('Error storing payment details:', error);
        res.status(500).json({ success: false, message: 'Failed to store payment details', error: error.message });
    }
};