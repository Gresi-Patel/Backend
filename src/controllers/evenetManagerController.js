import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getEvenetManager = async (req, res) => {
    try {

        const eventManager = await prisma.user.findMany({
            where: {
                role: "event_manager"
            }
        });
        res.json(eventManager);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export { getEvenetManager };