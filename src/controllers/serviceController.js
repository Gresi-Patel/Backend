import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createService = async (req, res) => {
    try {
        const { providerId, categoryId, description, price, name } = req.body;
        const service = await prisma.service.create({
            data: {
                providerId,
                categoryId,
                description,
                price: Number(price),
                name
            }
        });
        // console.log(service);
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

// Get all services
const getAllServices = async (req, res) => {
    try {
        let serviceProviderId = req.query.serviceProviderId;
        if (serviceProviderId) {
            const services = await prisma.service.findMany({
                where: { providerId: serviceProviderId },
                include: {
                    category: true,
                    subcategories: {
                        include: {
                            subtypes: true
                        }
                    },
                    feedbacks: true,
                    bookings: true
                },
            });
            res.json(services);

        }
        else {
            const services = await prisma.service.findMany({
                include: {
                    feedbacks: true,
                    provider: true,
                    category: true,
                    bookings: true,
                }
            });
            res.json(services);
        }

    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                feedbacks: true,
                provider: true,
                category: true,
                bookings: true,
            }
        });
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};




//delete services
const deleteService = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const user = await prisma.service.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        res.json({ message: "Service deleted successfully", user });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}




export { createService, getAllServices, getServiceById, deleteService };