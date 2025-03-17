const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController"); // Make sure this import is correct
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

// Create a new ticket (for users)
router.post("/", isLoggedIn, TicketController.createTicket);

// Get all tickets (for admins)
router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

// Update ticket status (for admins)
router.put("/:id", isLoggedIn, isAdmin, TicketController.updateTicketStatus);

// Get tickets created by the logged-in user
router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

// Assign a support user to a ticket (for admins)
router.put(
  "/assign/:ticketId",
  isLoggedIn,
  isAdmin,
  TicketController.assignTicket
);

module.exports = router;
