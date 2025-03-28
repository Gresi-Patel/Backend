import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
    // const {name,description,location,startDate,endDate} = req.body;
    try {
        const { name, startDate, endDate, address, managerId } = req.body;
        const event = await prisma.event.create({
            data: { name: name, start_date: new Date(startDate), end_date: new Date(endDate), address: address, managerId:managerId },
        });
        res.status(201).json({ message: "Event created", event });
    } catch (error) {
        // res.status(500).json({ error: error.message });
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export { createEvent };