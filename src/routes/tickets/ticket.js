const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");
const { createTicketDto } = require("../../dto/createTicket.dto");
const { assignToSupportDto } = require("../../dto/assignToSupport.dto");
const { adminUpdateTicketDto } = require("../../dto/adminUpdateTicket.dto");

/**
 * @typedef Ticket
 * @property {string} title.required - Title of the ticket
 * @property {string} description.required - Description of the issue
 * @property {string} status - Status of the ticket (open, in-progress, closed)
 * @property {string} user - User who created the ticket
 * @property {string} support - Support staff assigned
 * @property {string} createdAt - Date of creation
 */

/**
 * @route POST /tickets/create
 * @group Tickets - Ticket management
 * @security bearerAuth
 * @param {Ticket.model} body.body.required - Ticket creation data
 * @returns {Ticket.model} 200 - Ticket created successfully
 * @returns {Error} 400 - Validation error
 */
router.post(
  "/create",
  isLoggedIn,
  createTicketDto,
  TicketController.createTicket
);

/**
 * @route GET /tickets/my-tickets
 * @group Tickets - Ticket management
 * @security bearerAuth
 * @returns {Array.<Ticket>} 200 - List of tickets for logged-in user
 */
router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

/**
 * @route GET /tickets/{id}
 * @group Tickets - Ticket management
 * @security bearerAuth
 * @param {string} id.path.required - Ticket ID
 * @returns {Ticket.model} 200 - Ticket details
 * @returns {Error} 404 - Ticket not found
 */
router.get("/:id", isLoggedIn, TicketController.getTicketById);

/**
 * @route PUT /tickets/{id}
 * @group Tickets - Admin operations
 * @security bearerAuth
 * @param {string} id.path.required - Ticket ID
 * @param {Ticket.model} body.body.required - Updated ticket data
 * @returns {Ticket.model} 200 - Ticket updated successfully
 * @returns {Error} 404 - Ticket not found
 */
router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  adminUpdateTicketDto,
  TicketController.updateTicket
);

/**
 * @route DELETE /tickets/{id}
 * @group Tickets - Admin operations
 * @security bearerAuth
 * @param {string} id.path.required - Ticket ID
 * @returns {object} 200 - Deletion success message
 */
router.delete("/:id", isLoggedIn, isAdmin, TicketController.deleteTicket);

/**
 * @route GET /tickets
 * @group Tickets - Admin operations
 * @security bearerAuth
 * @returns {Array.<Ticket>} 200 - List of all tickets
 */
router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

/**
 * @route POST /tickets/{ticketId}/assign
 * @group Tickets - Admin operations
 * @security bearerAuth
 * @param {string} ticketId.path.required - Ticket ID
 * @param {object} body.body.required - { supportId: string }
 * @returns {object} 200 - Support assigned successfully
 */
router.post(
  "/:ticketId/assign",
  isLoggedIn,
  isAdmin,
  assignToSupportDto,
  TicketController.assignToSupport
);

/**
 * @route POST /tickets/{ticketId}/unassign
 * @group Tickets - Admin operations
 * @security bearerAuth
 * @param {string} ticketId.path.required - Ticket ID
 * @returns {object} 200 - Support unassigned successfully
 */
router.post(
  "/:ticketId/unassign",
  isLoggedIn,
  isAdmin,
  TicketController.unassignFromSupport
);

module.exports = router;
