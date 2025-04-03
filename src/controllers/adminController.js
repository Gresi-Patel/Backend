import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail } from '../../utils/mailer.js';
const prisma = new PrismaClient();

// Get all users (except admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: { not: "admin" } },
            select: { id: true, name: true, email: true, phoneNo: true, role: true,status:true, createdAt: true ,deletedAt:true },

        });
        console.log(users);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message  });
    }
};

// for service
const getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: {
                category: true, 
                provider: { select: { name: true, email: true } }
            },
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};


// Delete  user 
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

          // Check if the user is a service provider
          if (user.role !== "service_provider") {
            return res.status(400).json({ message: "Only service providers can be deleted" });
        }

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: { deletedAt: new Date() },
        });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// for total stats(deshboard)
const getTotalStats = async (req, res) => {
    try {
        const eventsCount = await prisma.event.count();
        const usersCount = await prisma.user.count();
        const servicesCount = await prisma.service.count();
    
        res.json({
          events: eventsCount,
          users: usersCount,
          services: servicesCount,
        });
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
}


//update status of service provider

const approveServiceProvider  = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({ where: { id: userId } });
    
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
    
        if (user.role !== "service_provider") {
            return res.status(400).json({ message: "Only service providers can be approved." });
        }

        if (user.status === "approved") {
            return res.status(400).json({ message: "User is already approved." });
        }
    
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status: "approved" }
        });
    
        // Send approval email

        await sendApprovalEmail(updatedUser.email, updatedUser.name);
        res.json({ message: "Service Provider approved successfully.", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};


const rejectServiceProvider= async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({ where: { id: userId } });
    
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
    
        if (user.role !== "service_provider") {
            return res.status(400).json({ message: "Only service providers can be rejected." });
        }

        
        if (user.status === "rejected") {
            return res.status(400).json({ message: "User is already rejected." });
        }
    
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status: "rejected" }
        });
    
        // Send rejection email
        await sendRejectionEmail(updatedUser.email, updatedUser.name);
        res.json({ message: "Service Provider rejected successfully.", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export {getAllUsers,getAllServices,deleteUser,getTotalStats,approveServiceProvider,rejectServiceProvider};