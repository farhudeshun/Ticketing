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
        status: "open", // Ensure default status
      });

      return res
        .status(201)
        .json({ message: "Ticket created successfully", ticket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res
        .status(500)
        .json({ message: "Error creating ticket", error: error.message });
    }
  },

  async getAllTickets(req, res) {
    try {
      // This route is for admins only (middleware should enforce this)
      const tickets = await Ticket.findAll({
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
          { model: User, as: "support", attributes: ["id", "name", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res
        .status(500)
        .json({ message: "Error fetching tickets", error: error.message });
    }
  },

  async getTicketById(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id, {
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
          { model: User, as: "support", attributes: ["id", "name", "email"] },
        ],
      });

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Authorization: allow if admin, or if the ticket belongs to the user, or if the user is assigned as support.
      if (
        req.user.role !== "admin" &&
        req.user.id !== ticket.userId &&
        req.user.id !== ticket.supportId
      ) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res
        .status(500)
        .json({ message: "Error fetching ticket", error: error.message });
    }
  },

  async getMyTickets(req, res) {
    try {
      const userId = req.user.id;

      const tickets = await Ticket.findAll({
        where: { userId },
        include: [
          { model: User, as: "support", attributes: ["id", "name", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Even if no tickets are found, return an empty array (not access denied)
      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      return res
        .status(500)
        .json({ message: "Error fetching user tickets", error: error.message });
    }
  },

  async getAssignedTickets(req, res) {
    try {
      const supportId = req.user.id;

      // This route is for support users; if a non-support user tries to access, return 403
      if (req.user.role !== "support") {
        return res
          .status(403)
          .json({ message: "Access denied. Support role required" });
      }

      const tickets = await Ticket.findAll({
        where: { supportId },
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (tickets.length === 0) {
        return res.status(404).json({ message: "No assigned tickets found" });
      }

      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      return res
        .status(500)
        .json({
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

      // Only admin or the support assigned to the ticket can update it
      if (req.user.role !== "admin" && req.user.id !== ticket.supportId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this ticket" });
      }

      if (supportId) {
        const supportUser = await User.findOne({
          where: { id: supportId, role: "support" },
        });
        if (!supportUser) {
          return res.status(400).json({ message: "Invalid support user" });
        }

        if (ticket.supportId === supportId) {
          return res
            .status(400)
            .json({
              message: "Ticket is already assigned to this support user",
            });
        }
        ticket.supportId = supportId;
        if (ticket.status === "open") {
          ticket.status = "in-progress";
        }
      }

      if (status) {
        // Only admin can set the status to 'closed'
        if (status === "closed" && req.user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Only admins can close tickets" });
        }
        ticket.status = status;
      }

      if (!status && !ticket.status) {
        ticket.status = "open";
      }

      await ticket.save();

      return res.status(200).json({
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
      return res
        .status(500)
        .json({ message: "Error updating ticket", error: error.message });
    }
  },

  async deleteTicket(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Only admins can delete tickets
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only" });
      }

      await ticket.destroy();
      return res.status(204).json({ message: "Ticket deleted successfully" });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return res
        .status(500)
        .json({ message: "Error deleting ticket", error: error.message });
    }
  },

  // (Optional) Admin-only full update of a ticket
  async adminUpdateTicket(req, res) {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const { subject, description, priority, status, supportId } = req.body;

      if (subject) ticket.subject = subject;
      if (description) ticket.description = description;
      if (priority) ticket.priority = priority;
      if (status) ticket.status = status;

      if (supportId) {
        const support = await User.findOne({
          where: { id: supportId, role: "support" },
        });
        if (!support) {
          return res.status(400).json({ message: "Invalid support user" });
        }
        ticket.supportId = supportId;
      }

      await ticket.save();
      return res.status(200).json({
        message: "Ticket updated by admin successfully",
        ticket,
      });
    } catch (error) {
      console.error("Admin ticket update error:", error);
      return res
        .status(500)
        .json({ message: "Error updating ticket", error: error.message });
    }
  },
};
