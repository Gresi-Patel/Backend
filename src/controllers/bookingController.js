import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const createBooking = async (req, res) => {
    // const {name, email, phone, date, time, people, message} = req.body

    const { eventId, serviceId, startTime, endTime, totalPrice } = req.body
    try {

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        const booking = await prisma.booking.create({
            data: {
                eventId: eventId,
                serviceId: serviceId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
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
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "accepted", "confirmed", "rejected", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid booking status" });
    }

    try {
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
        });
        console.log(updatedBooking)
        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: "Error updating booking status" });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                event: true,
                service: true,
                payments: true,
            },
        });
        res.json(bookings);

    }
    catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
}

const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.booking.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        res.json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting booking" });

    }

}

export { createBooking, updateBookingStatus, getAllBookings, deleteBooking };