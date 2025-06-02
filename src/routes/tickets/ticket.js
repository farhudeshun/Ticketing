const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");
const { createTicketDto } = require("../../dto/createTicket.dto");
const { assignToSupportDto } = require("../../dto/assignToSupport.dto");
const { adminUpdateTicketDto } = require("../../dto/adminUpdateTicket.dto");
router.post(
  "/create",
  isLoggedIn,
  createTicketDto,
  TicketController.createTicket
);

router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

router.get("/:id", isLoggedIn, TicketController.getTicketById);

router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  adminUpdateTicketDto,
  TicketController.updateTicket
);

router.delete("/:id", isLoggedIn, isAdmin, TicketController.deleteTicket);

router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

router.post(
  "/:ticketId/assign",
  isLoggedIn,
  isAdmin,
  assignToSupportDto,
  TicketController.assignToSupport
);

router.post(
  "/:ticketId/unassign",
  isLoggedIn,
  isAdmin,
  TicketController.unassignFromSupport
);

module.exports = router;
