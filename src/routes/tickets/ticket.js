const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.post("/", isLoggedIn, TicketController.createTicket);

router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

router.get("/:id", isLoggedIn, TicketController.getTicketById);

router.put("/:id", isLoggedIn, isAdmin, TicketController.updateTicket);

router.delete("/:id", isLoggedIn, isAdmin, TicketController.deleteTicket);

router.post(
  "/:ticketId/assign",
  isLoggedIn,
  isAdmin,
  TicketController.assignToSupport
);
router.post(
  "/:ticketId/unassign",
  isLoggedIn,
  isAdmin,
  TicketController.unassignFromSupport
);

module.exports = router;
