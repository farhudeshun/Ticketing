// routes/admin/index.js

const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

// Admin dashboard route
router.get("/", isLoggedIn, isAdmin, controller.dashboard);

// Update user role route
router.put("/users/:id/role", isLoggedIn, isAdmin, controller.updateUserRole);

// Get all tickets route (admin only)
router.get("/tickets", isLoggedIn, isAdmin, controller.getAllTickets);

// Update ticket status route (admin only)
router.put(
  "/tickets/:id/status",
  isLoggedIn,
  isAdmin,
  controller.updateTicketStatus
);

module.exports = router;
