const Ticket = require("../../models/tickets");
const User = require("../../models/user");

module.exports = {
  async createTicket(req, res) {
    try {
      const { subject, description, priority } = req.body;
      const userId = req.user.id;

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

  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll({
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      });

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res
        .status(500)
        .json({ message: "Error fetching tickets", error: error.message });
    }
  },

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

  async getMyTickets(req, res) {
    try {
      const userId = req.user.id;

      const tickets = await Ticket.findAll({
        where: { userId },
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      });

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res
        .status(500)
        .json({ message: "Error fetching user tickets", error: error.message });
    }
  },

  async assignTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const { supportId } = req.body;

      console.log("Assigning support ID:", supportId);

      const supportUser = await User.findOne({
        where: { id: supportId, role: "support" },
      });

      if (!supportUser) {
        return res.status(400).json({ message: "Invalid support user" });
      }

      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      console.log("Ticket before update:", ticket);

      ticket.supportId = supportId;
      ticket.status = "in-progress";
      await ticket.save();

      console.log("Ticket after update:", ticket);

      res.status(200).json({
        message: "Ticket assigned successfully",
        ticket,
      });
    } catch (error) {
      console.error("Error assigning ticket:", error);
      res.status(500).json({
        message: "Error assigning ticket",
        error: error.message,
      });
    }
  },
};
