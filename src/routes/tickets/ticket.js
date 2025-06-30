const express = require("express");
const router = express.Router();
const TicketController = require("../tickets/ticketController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");
const { createTicketDto } = require("../../dto/createTicket.dto");
const { assignToSupportDto } = require("../../dto/assignToSupport.dto");
const { adminUpdateTicketDto } = require("../../dto/adminUpdateTicket.dto");

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management and operations
 */

/**
 * @swagger
 * /tickets/create:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketDto'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  isLoggedIn,
  createTicketDto,
  TicketController.createTicket
);

/**
 * @swagger
 * /tickets/my-tickets:
 *   get:
 *     summary: Get tickets for the logged-in user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 */
router.get("/my-tickets", isLoggedIn, TicketController.getMyTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.get("/:id", isLoggedIn, TicketController.getTicketById);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Admin updates a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateTicketDto'
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Ticket not found
 */
router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  adminUpdateTicketDto,
  TicketController.updateTicket
);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Admin deletes a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ticket deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Ticket not found
 */
router.delete("/:id", isLoggedIn, isAdmin, TicketController.deleteTicket);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Admin fetches all tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/", isLoggedIn, isAdmin, TicketController.getAllTickets);

/**
 * @swagger
 * /tickets/{ticketId}/assign:
 *   post:
 *     summary: Admin assigns a support staff to a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignToSupportDto'
 *     responses:
 *       200:
 *         description: Support assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Ticket or support user not found
 */
router.post(
  "/:ticketId/assign",
  isLoggedIn,
  isAdmin,
  assignToSupportDto,
  TicketController.assignToSupport
);

/**
 * @swagger
 * /tickets/{ticketId}/unassign:
 *   post:
 *     summary: Admin unassigns support from a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support unassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Ticket not found
 */
router.post(
  "/:ticketId/unassign",
  isLoggedIn,
  isAdmin,
  TicketController.unassignFromSupport
);

module.exports = router;
