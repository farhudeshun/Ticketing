const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and operations
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin dashboard
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
 *             $ref: '#/components/schemas/UpdateUserRoleDto'
 *     responses:
 *       200:
 *         description: User role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *                 $ref: '#/components/schemas/Ticket'
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
 *             $ref: '#/components/schemas/UpdateTicketStatusDto'
 *     responses:
 *       200:
 *         description: Ticket status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */
router.put(
  "/tickets/:id/status",
  isLoggedIn,
  isAdmin,
  controller.updateTicketStatus
);

module.exports = router;
