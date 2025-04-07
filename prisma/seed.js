import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("Twing@25", 10); 

    const existingAdmin = await prisma.user.findUnique({
        where: { email: "admin@example.com" },
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: "Twin",
                email: "twing@gmail.com",
                password: hashedPassword,
                phoneNo: "1114567890",
                role: "admin", 
            },
        });
        console.log(" Admin user created successfully!");
    } else {
        console.log("Admin user already exists.");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
