const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

/**
 * @route GET /users/
 * @summary Get all users (Admin only)
 * @tags Users
 * @security bearerAuth
 * @returns {array<object>} 200 - List of all users
 */
router.get("/", isAdmin, controller.getAllUsers);

/**
 * @route GET /users/{id}
 * @summary Get user by ID
 * @tags Users
 * @security bearerAuth
 * @param {string} id.path.required - User ID
 * @returns {object} 200 - User object
 * @returns {404} 404 - User not found
 */
router.get("/:id", isLoggedIn, controller.getUserById);

/**
 * @route POST /users/
 * @summary Create a new user (Admin only)
 * @tags Users
 * @security bearerAuth
 * @param {object} request.body.required - User creation data
 * @returns {object} 201 - Created user object
 * @returns {400} 400 - Validation error
 */
router.post("/", isLoggedIn, isAdmin, controller.createUser);

/**
 * @route PUT /users/{id}
 * @summary Update entire user (Admin only)
 * @tags Users
 * @security bearerAuth
 * @param {string} id.path.required - User ID
 * @param {object} request.body.required - Updated user data
 * @returns {object} 200 - Updated user object
 * @returns {404} 404 - User not found
 */
router.put("/:id", isLoggedIn, isAdmin, controller.updateUser);

/**
 * @route DELETE /users/{id}
 * @summary Delete a user (Admin only)
 * @tags Users
 * @security bearerAuth
 * @param {string} id.path.required - User ID
 * @returns {204} 204 - No content (success)
 * @returns {404} 404 - User not found
 */
router.delete("/:id", isLoggedIn, isAdmin, controller.deleteUser);

/**
 * @route PATCH /users/{id}
 * @summary Partially update a user (Admin only)
 * @tags Users
 * @security bearerAuth
 * @param {string} id.path.required - User ID
 * @param {object} request.body.required - Partial user data
 * @returns {object} 200 - Updated user object
 * @returns {404} 404 - User not found
 */
router.patch("/:id", isLoggedIn, isAdmin, controller.patchUser);

module.exports = router;
