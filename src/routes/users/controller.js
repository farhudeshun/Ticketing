const User = require("../../models/user");
const _ = require("lodash");

module.exports = {
  async getAllUsers(req, res) {
    try {
      // Get all users, including their roles
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "isadmin"], // Add role to attributes
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        message: "Error fetching users",
        error: error.message,
      });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ["id", "name", "email"],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(_.pick(user, ["id", "name", "email"]));
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ensure that users can only update their own data (not role or other sensitive data)
      if (user.id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You can only update your own profile.",
        });
      }

      // Optionally, filter out role and isadmin fields to prevent update via user
      const updateData = _.omit(req.body, ["role", "isadmin"]);
      await user.update(updateData);

      res.status(200).json(_.pick(user, ["id", "name", "email"]));
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  },

  async patchUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ensure that users can only update their own data (not role or other sensitive data)
      if (user.id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You can only update your own profile.",
        });
      }

      // Optionally, filter out role and isadmin fields to prevent update via user
      const updateData = _.omit(req.body, ["role", "isadmin"]);
      await user.update(updateData);

      res.status(200).json(_.pick(user, ["id", "name", "email"]));
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Ensure that users can only delete their own account
      if (user.id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          message: "You can only delete your own account.",
        });
      }

      await user.destroy();
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  },
};
