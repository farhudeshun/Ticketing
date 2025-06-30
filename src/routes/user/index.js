const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn } = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Authenticated user endpoints
 */

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get dashboard info
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User dashboard
 *                 stats:
 *                   type: object
 */
router.get("/", isLoggedIn, controller.dashboard);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", isLoggedIn, controller.getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: Updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/me", isLoggedIn, controller.updateProfile);

/**
 * @swagger
 * /users/my-tickets:
 *   get:
 *     summary: Get tickets created by current user
 *     tags: [User]
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
router.get("/my-tickets", isLoggedIn, controller.getMyTickets);

module.exports = router;
