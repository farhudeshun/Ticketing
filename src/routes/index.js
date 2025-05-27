const express = require("express");
const router = express.Router();
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const adminRouter = require("../routes/admin");
const usersRoutes = require("../routes/users");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const error = require("../middlewares/error");
const ticketRoutes = require("./tickets/ticket");

const BASE_PATH = "/api/v1";

router.use(express.json());

router.use(BASE_PATH + "/auth", authRouter);

router.use(BASE_PATH + "/user", isLoggedIn, userRouter);

router.use(BASE_PATH + "/admin", isLoggedIn, isAdmin, adminRouter);

router.use(BASE_PATH + "/users", isLoggedIn, isAdmin, usersRoutes);

router.use(error);

router.use(BASE_PATH + "/tickets", ticketRoutes);

module.exports = router;
