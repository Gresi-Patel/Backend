import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const signupController = async (req, res) => {

    try {

        const { name, email, password, phoneNo, role } = req.body;

        if (!['event_manager', 'service_provider'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user is already exists or not
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).send("User already exists!");
        }

        const newUser = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, phoneNo,
                role,
                status: role === 'service_provider' ? 'pending' : 'approved'     // Set status based on role 
            }
        });

        res.status(201).json({ message: 'User registered successfully. Service providers require admin approval.', newUser });
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

        if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

        if (user.role === 'service_provider' && user.status !== 'approved') {
            return res.status(403).json({ message: 'Your account is pending approval.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login successful", token, role: user.role, userId: user.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });

    }
}

const getUsers = async (req, res) => {


    const { id } = req.params;
    try {
        const users = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!users) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
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
    catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export { signupController, loginController, getUsers, deleteUser };