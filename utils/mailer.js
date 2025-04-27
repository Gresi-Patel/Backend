import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "patelgresi11@gmail.com",
        pass: "grfw akol uhry xezz"
    }
});

// Function to send Approval Email
const sendApprovalEmail = async (toEmail, userName) => {
    try {
        const mailOptions = {
            from: "twing@gmail.com",
            to: toEmail,
            subject: "Service Provider Approval - One Place Event",
            html: `
                <h2>Hello ${userName},</h2>
                <p>Congratulations! Your service provider account has been approved.</p>
                <p>You can now log in and manage your services.</p>
                <p><a href="https://oneplace-event.netlify.app/login">Login Here</a></p>
                <p>Best Regards,<br>One Place Event Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${toEmail}`);
    } catch (error) {
        console.error("Error sending approval email:", error);
    }
};

// Send OTP Email
const sendOtpEmail = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: "twing@gmail.com",
            to: toEmail,
            subject: "Your OTP Code - One Place Event",
            html: `
                <h2>One Time Password (OTP)</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best Regards,<br>One Place Event Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${toEmail}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};


// ✅ Function to send Rejection Email
const sendRejectionEmail = async (toEmail, userName) => {
    try {
        const mailOptions = {
            from: "twing@gmail.com",
            to: toEmail,
            subject: "Service Provider Rejection - One Place Event",
            html: `
                <h2>Hello ${userName},</h2>
                <p>We regret to inform you that your service provider request has been rejected.</p>
                <p>If you think this is a mistake, please contact our support team.</p>
                <p>Best Regards,<br>One Place Event Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent to ${toEmail}`);
    } catch (error) {
        console.error("Error sending rejection email:", error);
    }
};

export { sendApprovalEmail, sendRejectionEmail ,sendOtpEmail};
