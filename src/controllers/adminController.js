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

        const user = await prisma.user.findUnique({ where: { id} });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

          // Check if the user is a service provider
          if (user.role !== "service_provider") {
            return res.status(400).json({ message: "Only service providers can be deleted" });
        }

        await prisma.user.update({
            where: { id },
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
        const userId = req.params.id;

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
        const userId = req.params.id;

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

// get all bookings
const getAllBookings=async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                event: true,
                service: true,
                payments: true,
            },
        });
        console.log(bookings)
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
}

//aprove bookings
const approveBooking = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received booking ID for approval:", id);

        // First: Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = await prisma.booking.update({
            where: {id: id },
            data: { status: "approved" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        console.error("Approval error:", error); 
        res.status(500).json({ message: "Error approving booking", error: error.message });
    }
}

//reject bookings
const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id:id },
            data: { status: "rejected" },
        });
        res.status(200).json(booking);
    }
    catch (error) {
        
        res.status(500).json({ message: "Error rejecting booking", error: error.message });
    }
}


// GET /admin/stats
const getStats = async (req, res) => {
  try {
    const eventsCount = await prisma.event.count();
    const usersCount = await prisma.user.count({
      where: { role: { not: "admin" } },
    });
    const servicesCount = await prisma.service.count();
    const bookingsCount = await prisma.booking.count(
      {
        where: {
          status: "pending",
        },
      }
    );

    res.json({
      events: eventsCount,
      users: usersCount,
      services: servicesCount,
      bookings: bookingsCount,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /admin/event-trends
const getEventTrends = async (req, res) => {
    try {
      const result = await prisma.event.groupBy({
        by: ['createdAt'],
      });
  
      const monthlyCounts = {};
  
      result.forEach(item => {
        const date = new Date(item.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      });
  
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      const final = months.map(month => ({
        month,
        events: monthlyCounts[month] || 0,
      }));
  
      res.json(final);
    } catch (error) {
      console.error("Error fetching event trends:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // GET /admin/booking-status-summary
const getBookingStatusSummary = async (req, res) => {
    try {
      const result = await prisma.booking.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });
  
      const formatted = result.map(item => ({
        name: item.status,
        value: item._count.status,
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error("Error fetching booking status summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // GET /admin/recent-bookings
const getRecentBookings = async (req, res) => {
    try {
      const bookings = await prisma.booking.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        include: {
          event: {
            select: {
              manager: {
                select: {
                  name: true,
                },
              },
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
      });
  
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


export {getAllUsers,getAllServices,deleteUser,getStats,getTotalStats,approveServiceProvider,rejectServiceProvider,getAllBookings,approveBooking,rejectBooking,getEventTrends,getBookingStatusSummary,getRecentBookings};