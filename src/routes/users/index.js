const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.get("/", isAdmin, controller.getAllUsers);

router.get("/:id", isLoggedIn, controller.getUserById);
router.post("/", isLoggedIn, isAdmin, controller.createUser);
router.put("/:id", isLoggedIn, isAdmin, controller.updateUser);
router.delete("/:id", isLoggedIn, isAdmin, controller.deleteUser);
router.patch("/:id", isLoggedIn, isAdmin, controller.patchUser);

module.exports = router;
