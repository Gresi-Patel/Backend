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
    if (!["pending", "accepted", "confirmed", "rejected", "cancelled","approved","completed"].includes(status)) {
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
        // console.log(bookings)
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

//aprove bookings
const acceptedBooking = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received booking ID for approval:", id);

        // First: Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = await prisma.booking.update({
            where: {id: id },
            data: { status: "accepted" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        console.error("Accepted error:", error); 
        res.status(500).json({ message: "Error accepted booking", error: error.message });
    }
}

//reject bookings
const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id:id },
            data: { status: "rejected" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        
        res.status(500).json({ message: "Error rejecting booking", error: error.message });
    }
}

const confirmedBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id:id },
            data: { status: "confirmed" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: "Error confirming booking", error: error.message });
    }
}

const cancelledBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id:id },
            data: { status: "cancelled" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
}






export { createBooking, updateBookingStatus, getAllBookings, deleteBooking ,acceptedBooking,rejectBooking,confirmedBooking,cancelledBooking};