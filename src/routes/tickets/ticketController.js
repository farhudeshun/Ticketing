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
  async getAssignedTickets(req, res) {
    try {
      const supportId = req.user.id;

      const tickets = await Ticket.findAll({
        where: { supportId },
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      });

      if (tickets.length === 0) {
        return res.status(404).json({ message: "No assigned tickets found" });
      }

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      res.status(500).json({
        message: "Error fetching assigned tickets",
        error: error.message,
      });
    }
  },

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { status, supportId } = req.body;

      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (supportId) {
        const supportUser = await User.findOne({
          where: { id: supportId, role: "support" },
        });
        if (!supportUser) {
          return res.status(400).json({ message: "Invalid support user" });
        }

        if (ticket.supportId === supportId) {
          return res.status(400).json({
            message: "Ticket is already assigned to this support user",
          });
        }
        ticket.supportId = supportId;

        if (ticket.status === "open") {
          ticket.status = "in-progress";
        }
      }
      if (status) {
        ticket.status = status;
      }
      if (!status && !ticket.status) {
        ticket.status = "open";
      }

      await ticket.save();

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
