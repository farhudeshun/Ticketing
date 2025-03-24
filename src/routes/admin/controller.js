const controller = require("../../routes/controller");
const User = require("../../models/user");
const Ticket = require("../../models/tickets");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");
const checkRole = require("../../middlewares/checkRoles");

module.exports = new (class extends controller {
  // Admin Dashboard (only accessible by admin)
  async dashboard(req, res) {
    res.send("admin dashboard");
  }

  // Update User Role (only accessible by admin)
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      console.log("Received request to update role:", { id, role });

      if (!role || !["admin", "support", "user"].includes(role)) {
        console.log("Invalid role detected");
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id === req.user.id) {
        console.log("User attempted to change their own role");
        return res
          .status(403)
          .json({ message: "You cannot change your own role" });
      }

      if (user.role === role) {
        console.log(`User already has the role: ${role}`);
        return res
          .status(400)
          .json({ message: `User already has the ${role} role` });
      }

      console.log("Updating user role...");
      user.role = role;
      await user.save();

      console.log("User role updated successfully, sending response...");
      return res.status(200).json({
        message: `User role updated to ${user.role}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res
        .status(500)
        .json({ message: "Error updating user role", error: error.message });
    }
  }

  // Get All Tickets (for Admin only)
  async getAllTickets(req, res) {
    try {
      // Fetch all tickets for the admin
      const tickets = await Ticket.findAll(); // Adjust this query as needed based on your database
      return res.status(200).json({ tickets });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch tickets", error });
    }
  }

  // Update Ticket Status (for Admin only)
  async updateTicketStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      ticket.status = status;
      await ticket.save();
      return res.status(200).json({
        message: `Ticket status updated to ${status}`,
        ticket,
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      return res
        .status(500)
        .json({ message: "Error updating ticket status", error });
    }
  }
})();
