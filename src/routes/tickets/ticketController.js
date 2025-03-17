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

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { status, supportId } = req.body;

      // Find the ticket by its ID
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // If supportId is provided, assign the support user
      if (supportId) {
        // Check if the support user exists and has the correct role
        const supportUser = await User.findOne({
          where: { id: supportId, role: "support" },
        });
        if (!supportUser) {
          return res.status(400).json({ message: "Invalid support user" });
        }

        // Check if the ticket is already assigned to the same support user
        if (ticket.supportId === supportId) {
          return res
            .status(400)
            .json({
              message: "Ticket is already assigned to this support user",
            });
        }

        // Assign the support user to the ticket
        ticket.supportId = supportId;

        // Set status to "in-progress" if the ticket was initially "open"
        if (ticket.status === "open") {
          ticket.status = "in-progress";
        }
      }

      // If a status is provided, update the ticket's status
      if (status) {
        ticket.status = status;
      }

      // If no status is provided and ticket was not assigned yet, set status to "open"
      if (!status && !ticket.status) {
        ticket.status = "open";
      }

      // Save the updated ticket
      await ticket.save();

      // Respond with the updated ticket
      res.status(200).json({
        message: "Ticket updated successfully",
        ticket: {
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          userId: ticket.userId,
          supportId: ticket.supportId,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({
        message: "Error updating ticket",
        error: error.message,
      });
    }
  },
};
