// routes/admin/index.js

const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.get("/", isLoggedIn, isAdmin, controller.dashboard);

router.put("/users/:id/role", isLoggedIn, isAdmin, controller.updateUserRole);

router.get("/tickets", isLoggedIn, isAdmin, controller.getAllTickets);

router.put(
  "/tickets/:id/status",
  isLoggedIn,
  isAdmin,
  controller.updateTicketStatus
);

module.exports = router;
