import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';


const generateOtp = () => crypto.randomInt(1000, 9999).toString();

// send OTP email
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        const otp = generateOtp();
        const expire_at = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
        await prisma.oTP.create({
            data: {
                email,
                otp,
                expire_at,
            },
        });
        await sendOtpEmail(email, otp);
        res.json({ message: "OTP sent successfully!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ message: "Email and OTP are required" });

        const otpRecord = await prisma.oTP.findFirst({
            where: { email, otp, status: "pending" },
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (new Date() > new Date(otpRecord.expire_at)) {
            await prisma.oTP.update({
                where: { id: otpRecord.id },
                data: { status: "expired" },
            });
            return res.status(400).json({ message: "OTP expired" });
        }

        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: {
                status: "verified",
                verified_at: new Date(),
            },
        });

        // Invalidate other pending OTPs for this email
        await prisma.oTP.updateMany({
            where: {
                email,
                id: { not: otpRecord.id },
                status: "pending",
            },
            data: {
                status: "invalid",
            },
        });

        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword)
            return res.status(400).json({ message: "Email and new password required" });

        const verifiedOtp = await prisma.oTP.findFirst({
            where: {
                email,
                status: "verified",
            },
            orderBy: {
                verified_at: "desc",
            },
        });

        if (!verifiedOtp) {
            return res.status(403).json({ message: "OTP not verified. Please verify OTP first." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        res.json({ message: "Password reset successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting password" });
    }
}

export { sendOtp, verifyOtp, resetPassword };






