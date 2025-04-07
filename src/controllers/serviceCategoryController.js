import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createServiceCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Category name is required." });
          }

          // Check if category exists (case-insensitive)
    let existingCategory = await prisma.serviceCategory.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive", // case-insensitive match
          },
        },
      });
  
      if (existingCategory) {
        return res.status(200).json(existingCategory); // Return existing
      }
        
        const serviceCategory = await prisma.serviceCategory.create({
            data: {
                name: name.trim(),
              },
        });
        res.status(201).json(serviceCategory);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export {createServiceCategory};