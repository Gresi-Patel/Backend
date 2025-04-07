import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createSubType = async (req, res) => {
    const { subcategoryId, name, price } = req.body;
    try {
        const subtype = await prisma.subtype.create({
            data: {
                name,
                price: parseFloat(price),
                subcategoryId,
            },
        });
        res.status(201).json(subtype);
    } catch (err) {
        res.status(500).json({ error: "Failed to create subtype", err });
    }
}

export { createSubType };