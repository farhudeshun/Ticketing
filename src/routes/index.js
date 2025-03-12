const express = require("express");
const router = express.Router();
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const adminRouter = require("../routes/admin");
const usersRoutes = require("../routes/users"); // Additional users routes
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const error = require("../middlewares/error");
const ticketRoutes = require("./tickets/ticket");

// Middleware
router.use(express.json());

// Routes
router.use("/auth", authRouter);
router.use("/user", isLoggedIn, userRouter);
router.use("/admin", isLoggedIn, isAdmin, adminRouter);
router.use("/users", usersRoutes); // Separate users route
router.use(error);
router.use("/tickets", ticketRoutes);

module.exports = router;
