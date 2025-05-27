const controller = require("../../routes/controller");
const User = require("../../models/user");
const Ticket = require("../../models/tickets");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");
const checkRole = require("../../middlewares/checkRoles");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.send("admin dashboard");
  }

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["admin", "support", "user"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Role must be 'admin', 'support', or 'user'",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      return res.status(200).json({
        message: "User role updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res
        .status(500)
        .json({ message: "Error updating user role", error: error.message });
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.find()
        .populate("userId", "name email")
        .populate("supportId", "name email")
        .sort("-createdAt");

      return res.status(200).json({
        message: "Tickets fetched successfully",
        tickets,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res
        .status(500)
        .json({ message: "Error fetching tickets", error: error.message });
    }
  }

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id)
        .populate("userId", "name email")
        .populate("supportId", "name email");

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.status(200).json({
        message: "Ticket fetched successfully",
        ticket,
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res
        .status(500)
        .json({ message: "Error fetching ticket", error: error.message });
    }
  }

  async updateTicketStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const ticket = await Ticket.findById(id);
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
