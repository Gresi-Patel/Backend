import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
    // const {name,description,location,startDate,endDate} = req.body;
    try {
        const { name, startDate, endDate, address, managerId } = req.body;
        const event = await prisma.event.create({
            data: { name: String(name), start_date: new Date(startDate), end_date: new Date(endDate), address: address, managerId: managerId },
        });
        res.status(201).json({ message: "Event created", event });
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

const getEvent = async (req, res) => {
    try {
        let eventManagerId = req.query.eventManagerId;
        if (eventManagerId) {
            const events = await prisma.event.findMany({
                where: { managerId: eventManagerId },
                include: { manager: true }
            });
            res.json(events);
        }
        else {
            const events = await prisma.event.findMany();
            res.json(events);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}


// for edit
const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!eventId || typeof eventId !== "string") {
            return res.status(400).json({ message: "Invalid event ID" });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                manager: true, 
                bookings: {
                    include: {
                        service: true,
                        event:{
                            include: {
                                manager: true, 
                            },
                        }
                    }
                }
            } // Corrected table names
        });

        console.log("Fetched Event:", event);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);

    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const user = await prisma.event.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export { createEvent, getEvent, deleteEvent, getEventById };