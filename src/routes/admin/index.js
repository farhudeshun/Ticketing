const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

/**
 * @swagger
 * /admin/:
 *   get:
 *     tags: [Admin]
 *     summary: Admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard accessed
 */
router.get("/", isLoggedIn, isAdmin, controller.dashboard);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     summary: Update user role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: support
 *     responses:
 *       200:
 *         description: User role updated
 */
router.put("/users/:id/role", isLoggedIn, isAdmin, controller.updateUserRole);

/**
 * @swagger
 * /admin/tickets:
 *   get:
 *     tags: [Admin]
 *     summary: Get all tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Ticket'
 */
router.get("/tickets", isLoggedIn, isAdmin, controller.getAllTickets);

/**
 * @swagger
 * /admin/tickets/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Update ticket status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in-progress, closed]
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Ticket status updated
 */
router.put(
  "/tickets/:id/status",
  isLoggedIn,
  isAdmin,
  controller.updateTicketStatus
);

module.exports = router;
