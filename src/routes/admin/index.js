const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

// Admin-only route to update user role
router.put("/users/:id/role", isLoggedIn, isAdmin, controller.updateUserRole);

router.get("/", controller.dashboard);

module.exports = router;
