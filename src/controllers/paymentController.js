import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const storePaymentDetails = async (req, res) => {
    const { transactionId, amount, bookingId } = req.body;

    try {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');

        const razorpayResponse = await axios.post(
            `https://api.razorpay.com/v1/payments/${transactionId}/capture`,
            { amount: amount * 100, currency: 'INR' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        const transactionData = razorpayResponse.data;
        const bookingDetails = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                event: true,
                service: true,
            },
        });


        // Create invoice PDF path and generate PDF
        const invoiceDir = path.join('public', 'invoices');
        fs.mkdirSync(invoiceDir, { recursive: true });

        const invoiceFilename = `invoice-${transactionData.id}.pdf`;
        const invoicePath = path.join(invoiceDir, invoiceFilename);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(invoicePath);
        doc.pipe(stream);
        const { event, service } = bookingDetails;

        // Header
        doc
            .fillColor('#2a5d9f')
            .fontSize(26)
            .text("OnePlaceEvent", { align: 'center' })
            .moveDown(0.3)
            .fontSize(12)
            .fillColor('#888')
            .text('Your One Stop Solution for Event Management', { align: 'center' })
            .moveDown();

        // Invoice title
        doc
            .moveDown()
            .fontSize(18)
            .fillColor('#000')
            .text('Invoice', { underline: true });

        // Transaction Details
        doc.moveDown(0.8);
        doc.fontSize(12).fillColor('#000');
        doc.text(`Transaction ID: ${transactionData.id}`);
        doc.text(`Booking ID: ${bookingDetails.id}`);
        doc.text(`Payment Method: ${transactionData.method}`);
        doc.text(`Currency: ${transactionData.currency}`);
        doc.text(`Status: ${transactionData.status}`);

        // Amount
        doc
            .moveDown(0.5)
            .fontSize(14)
            .fillColor('green')
            .text(`Amount Paid: Rs. ${(transactionData.amount / 100).toFixed(2)}`, { bold: true });

        // Event Details
        if (event) {
            doc
                .moveDown(1)
                .fontSize(16)
                .fillColor('#333')
                .text('Event Details', { underline: true });

            const formattedDate = new Date(event.startDate).toLocaleDateString('en-GB');
            doc
                .moveDown(0.3)
                .fontSize(12)
                .fillColor('#000')
                .text(`Event Name: ${event.name}`)
                .text(`Date: ${formattedDate}`)
                .text(`Venue: ${event.address}`);
        }

        // Services
        if (service) {
            doc
                .moveDown(1)
                .fontSize(16)
                .fillColor('#333')
                .text('Selected Service', { underline: true });

            doc
                .fontSize(12)
                .fillColor('#000')
                .text(`${service.name} - Rs. ${service.price}`);
        }

        // Footer
        doc
            .moveDown(2)
            .fontSize(11)
            .fillColor('#888')
            .text('Thank you for booking with OnePlaceEvent.', { align: 'center' })
            .text('We hope your event turns out amazing!', { align: 'center' });

doc.end();
        stream.on('finish', async () => {
            //  Store payment including the pdfUrl
            const storedPayment = await prisma.payment.create({
                data: {
                    transactionId: transactionData.id,
                    amount: transactionData.amount,
                    currency: transactionData.currency,
                    status: transactionData.status,
                    method: transactionData.method,
                    bookingId: bookingId,
                    invoiceUrl: `/invoices/${invoiceFilename}`,
                },
            });

            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'confirmed' },
            });

            res.status(201).json({
                success: true,
                message: 'Payment stored and invoice generated',
                payment: storedPayment,
            });
        });
    } catch (error) {
        console.error('Error storing payment details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to store payment details',
            error: error.message,
        });
    }
};
