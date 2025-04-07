import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createSubCategory = async (req, res) => {
    const { serviceId, name } = req.body;
    try {
        const subcategory = await prisma.subcategory.create({
            data: {
                name,
                serviceId,
            },
            include: {
                service: true,    // Include parent service details
                subtypes: true,   // Include any subtypes (will be empty initially)
            }
        });
        res.status(201).json(subcategory);
    } catch (err) {
        res.status(500).json({ error: "Failed to create subcategory", err });
    }

}

const getSubCategories = async (req, res) => {
    try {
        const subcategories = await prisma.subcategory.findMany({
            where: { serviceId: req.params.id },
            include: {
                subtypes: true,
            },
        });
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch subcategories", err });
    }

}

export { createSubCategory, getSubCategories }