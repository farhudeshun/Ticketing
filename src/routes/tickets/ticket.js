const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.post("/", isLoggedIn, TicketController.createTicket);

router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

router.put("/:id", isLoggedIn, isAdmin, TicketController.updateTicket);

router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

router.put(
  "/assign/:ticketId",
  isLoggedIn,
  isAdmin,
  TicketController.updateTicket
);
router.get("/assigned", isLoggedIn, TicketController.getAssignedTickets);

module.exports = router;
