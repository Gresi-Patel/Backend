import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const signupController = async (req, res) => {

    try {

        const { name, email, password, phoneNo, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // console.log("Received request body:", req.body);

        // Check if user is already exists or not
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).send("User already exists!");
        }

        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, phoneNo, role }
        });

        res.status(201).json({ message: "User registered successfully", newUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }

};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        console.log("User found:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        // console.log(isValid)
        if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });

    }
}

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

const deleteUser = async(req, res) => {
    try{
        const id = Number(req.params.id); 
        if (!id) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const user = await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }  
        });
        res.json(user);

    }
    catch(error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export { signupController, loginController, getUsers ,deleteUser};