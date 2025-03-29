import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const createBooking = async (req, res) => {
    // const {name, email, phone, date, time, people, message} = req.body

    const { eventId, serviceId, startTime, endTime, totalPrice } = req.body
    try {
        const booking = await prisma.booking.create({
            data: {
                eventId: eventId,
                serviceId: serviceId,
                startTime: startTime,
                endTime: endTime,
                totalPrice: totalPrice
            },
        });
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating booking" });
    }
}


const updateBookingStatus = async (req, res) => {
    try {
        // const booking = await prisma.booking.findMany({
        //     where: {
        //         status: 'pending',
        //     },
        // });
        // res.json(booking);

        const { id, status } = req.body
        const booking = await prisma.booking.update({
            where: { id: id },
            data: { status: status }
        });
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
}


export { createBooking, updateBookingStatus };