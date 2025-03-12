const Ticket = require("../../models/tickets");
const User = require("../../models/user");

module.exports = {
  // Create a new ticket (for users)
  async createTicket(req, res) {
    try {
      const { subject, description, priority } = req.body;
      const userId = req.user.id; // Get the logged-in user's ID

      const ticket = await Ticket.create({
        subject,
        description,
        priority,
        userId,
      });

      res.status(201).json({ message: "Ticket created successfully", ticket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res
        .status(500)
        .json({ message: "Error creating ticket", error: error.message });
    }
  },

  // Get all tickets (for admins)
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll({
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ], // Include user details
      });

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res
        .status(500)
        .json({ message: "Error fetching tickets", error: error.message });
    }
  },

  // Update ticket status (for admins)
  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      ticket.status = status;
      await ticket.save();

      res
        .status(200)
        .json({ message: "Ticket status updated successfully", ticket });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      res.status(500).json({
        message: "Error updating ticket status",
        error: error.message,
      });
    }
  },

  // Get tickets created by the logged-in user
  async getMyTickets(req, res) {
    try {
      const userId = req.user.id; // Get the logged-in user's ID

      const tickets = await Ticket.findAll({
        where: { userId },
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ], // Include user details
      });

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res
        .status(500)
        .json({ message: "Error fetching user tickets", error: error.message });
    }
  },
};
