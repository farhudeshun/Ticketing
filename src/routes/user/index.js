const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn } = require("../../middlewares/auth");

/**
 * @route GET /users/
 * @summary Get dashboard info
 * @tags User
 * @security bearerAuth
 * @returns {object} 200 - Dashboard data
 */
router.get("/", isLoggedIn, controller.dashboard);

/**
 * @route GET /users/me
 * @summary Get current user's profile
 * @tags User
 * @security bearerAuth
 * @returns {object} 200 - User profile
 */
router.get("/me", isLoggedIn, controller.getProfile);

/**
 * @route PUT /users/me
 * @summary Update current user's profile
 * @tags User
 * @security bearerAuth
 * @param {object} request.body.required - Profile update data
 * @returns {object} 200 - Updated user profile
 */
router.put("/me", isLoggedIn, controller.updateProfile);

/**
 * @route GET /users/my-tickets
 * @summary Get tickets created by current user
 * @tags User
 * @security bearerAuth
 * @returns {array} 200 - List of user's tickets
 */
router.get("/my-tickets", isLoggedIn, controller.getMyTickets);

module.exports = router;
