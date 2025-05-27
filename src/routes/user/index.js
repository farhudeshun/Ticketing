const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn } = require("../../middlewares/auth");

router.get("/", isLoggedIn, controller.dashboard);
router.get("/me", isLoggedIn, controller.getProfile);
router.put("/me", isLoggedIn, controller.updateProfile);
router.get("/my-tickets", isLoggedIn, controller.getMyTickets);

module.exports = router;
