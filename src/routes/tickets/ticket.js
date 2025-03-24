const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

// Create a new ticket (accessible to any logged-in user)
router.post("/", isLoggedIn, TicketController.createTicket);

// Get tickets created by the logged-in user
router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

// Get all tickets (accessible only to admins)
router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

// Get a ticket by its ID
router.get("/:id", isLoggedIn, TicketController.getTicketById);

// Update a ticket (accessible only to admins or assigned support)
router.put("/:id", isLoggedIn, isAdmin, TicketController.updateTicket);

// Delete a ticket (accessible only to admins)
router.delete("/:id", isLoggedIn, isAdmin, TicketController.deleteTicket);

module.exports = router;
