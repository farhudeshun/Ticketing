const Ticket = require("../../models/tickets");
const User = require("../../models/user");

module.exports = {
  async createTicket(req, res) {
    try {
      const { title, description, priority } = req.body;
      const userId = req.user._id;

      const ticket = await Ticket.create({
        title,
        description,
        priority,
        userId,
        status: "open",
        supportId: null,
      });

      return res.status(201).json({
        message: "Ticket created successfully",
        ticket,
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({
        message: "Error creating ticket",
        error: error.message,
      });
    }
  },

  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.find()
        .populate("userId", "name email")
        .populate("supportId", "name email")
        .sort("-createdAt");

      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res.status(500).json({
        message: "Error fetching tickets",
        error: error.message,
      });
    }
  },

  async getTicketById(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id)
        .populate("userId", "name email")
        .populate("supportId", "name email");

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (
        req.user.role !== "admin" &&
        req.user._id.toString() !== ticket.userId.toString() &&
        req.user._id.toString() !== ticket.supportId?.toString()
      ) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res.status(500).json({
        message: "Error fetching ticket",
        error: error.message,
      });
    }
  },

  async getMyTickets(req, res) {
    try {
      const userId = req.user._id;
      const tickets = await Ticket.find({ userId })
        .populate("supportId", "name email")
        .sort("-createdAt");

      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      return res.status(500).json({
        message: "Error fetching user tickets",
        error: error.message,
      });
    }
  },

  async getAssignedTickets(req, res) {
    try {
      const supportId = req.user._id;

      if (req.user.role !== "support") {
        return res.status(403).json({
          message: "Access denied. Support role required",
        });
      }

      const tickets = await Ticket.find({ supportId })
        .populate("userId", "name email")
        .sort("-createdAt");

      if (tickets.length === 0) {
        return res.status(404).json({ message: "No assigned tickets found" });
      }

      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      return res.status(500).json({
        message: "Error fetching assigned tickets",
        error: error.message,
      });
    }
  },

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { status, supportId } = req.body;

      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (
        req.user.role !== "admin" &&
        req.user._id.toString() !== ticket.supportId?.toString()
      ) {
        return res.status(403).json({
          message: "Unauthorized to update this ticket",
        });
      }

      if (supportId) {
        const supportUser = await User.findOne({
          _id: supportId,
          role: "support",
        });

        if (!supportUser) {
          return res.status(400).json({ message: "Invalid support user" });
        }

        if (ticket.supportId?.toString() === supportId) {
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

      const updatedTicket = await Ticket.findById(id)
        .populate("userId", "name email")
        .populate("supportId", "name email");

      return res.status(200).json({
        message: "Ticket updated successfully",
        ticket: updatedTicket,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      return res.status(500).json({
        message: "Error updating ticket",
        error: error.message,
      });
    }
  },

  async deleteTicket(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can delete tickets" });
      }

      await Ticket.findByIdAndDelete(req.params.id);
      return res.status(200).send();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return res.status(500).json({
        message: "Error deleting ticket",
        error: error.message,
      });
    }
  },

  async adminUpdateTicket(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const { title, description, priority, status, supportId } = req.body;

      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (priority) ticket.priority = priority;
      if (status) ticket.status = status;

      if (supportId) {
        const support = await User.findOne({
          _id: supportId,
          role: "support",
        });
        if (!support) {
          return res.status(400).json({ message: "Invalid support user" });
        }
        ticket.supportId = supportId;
      }

      await ticket.save();

      const updatedTicket = await Ticket.findById(req.params.id)
        .populate("userId", "name email")
        .populate("supportId", "name email");

      return res.status(200).json({
        message: "Ticket updated by admin successfully",
        ticket: updatedTicket,
      });
    } catch (error) {
      console.error("Admin ticket update error:", error);
      return res.status(500).json({
        message: "Error updating ticket",
        error: error.message,
      });
    }
  },

  async assignToSupport(req, res) {
    try {
      const { ticketId } = req.params;
      const { supportId } = req.body;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const supportUser = await User.findOne({
        _id: supportId,
        role: "support",
      });
      if (!supportUser) {
        return res.status(400).json({ message: "Invalid support user" });
      }

      ticket.supportId = supportId;
      if (ticket.status === "open") {
        ticket.status = "in-progress";
      }
      await ticket.save();

      if (!supportUser.assignedTickets.includes(ticketId)) {
        supportUser.assignedTickets.push(ticketId);
        await supportUser.save();
      }

      const updatedUser = await User.findById(supportId)
        .select("-password")
        .populate("assignedTickets");

      return res.status(200).json({
        message: "Ticket assigned to support user",
        supportUser: updatedUser,
      });
    } catch (error) {
      console.error("Error assigning ticket:", error);
      return res.status(500).json({
        message: "Error assigning ticket",
        error: error.message,
      });
    }
  },

  async unassignFromSupport(req, res) {
    try {
      const { ticketId } = req.params;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (!ticket.supportId) {
        return res.status(400).json({ message: "Ticket is not assigned" });
      }

      const supportUser = await User.findById(ticket.supportId);
      if (!supportUser) {
        return res.status(404).json({ message: "Support user not found" });
      }

      supportUser.assignedTickets = supportUser.assignedTickets.filter(
        (id) => id.toString() !== ticketId
      );
      await supportUser.save();

      ticket.supportId = null;
      ticket.status = "open";
      await ticket.save();

      return res.status(200).json({
        message: "Ticket unassigned from support user",
        ticket,
      });
    } catch (error) {
      console.error("Error unAssigning ticket:", error);
      return res.status(500).json({
        message: "Error unAssigning ticket",
        error: error.message,
      });
    }
  },
};
