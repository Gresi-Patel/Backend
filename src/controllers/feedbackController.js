import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createFeedback = async (req, res) => {
    try {
        const { serviceId, userId, rate, comment } = req.body;

        // const feedback = await prisma.feedback.create({
        //     data: {
        //         eventId: Number(eventId),
        //         userId: Number(userId),
        //         rate: Number(rate),
        //         comment: comment || null
        //     }
        // });
        // res.status(201).json(feedback);

        //  Check if user exists and is an event_manager
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== "event_manager") {
            return res.status(403).json({ error: "Only Event Managers can give feedback!" });
        }

        const feedback = await prisma.feedback.create({
            data: {
                serviceId,
                userId,
                rate,
                comment
            }
        });

        res.json({ message: "Feedback submitted successfully", feedback });

    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

const getFeedback = async (req, res) => {
    const { serviceId, userId } = req.query;

    // Query Filter
    let whereCondition = {};
    if (serviceId) whereCondition.eventId = parseInt(eventId);
    if (userId) whereCondition.userId = parseInt(userId);

    try {
        const feedbacks = await prisma.feedback.findMany({
            where: whereCondition,
            include: {
                service: { select: { name: true } },
                user: { select: { name: true, role: true } }
            }
        });
        res.json(feedbacks);

    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });

    }

}

export { createFeedback, getFeedback };