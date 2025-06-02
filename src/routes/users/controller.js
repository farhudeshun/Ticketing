const User = require("../../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports = new (class {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}, "-password");
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json(_.pick(user, ["_id", "name", "email"]));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { name, email } = req.body;
      const updateData = { name, email };

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(updatedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async patchUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (
        user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You can only update your own profile.",
        });
      }

      const updateData = _.omit(req.body, ["role", "password"]);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select("-password");

      res.status(200).json(_.pick(updatedUser, ["_id", "name", "email"]));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      // if (req.user._id.toString() !== req.params.id) {
      //   return res.status(403).json({ message: "Unauthorized" });
      // }

      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "user deleted", deletedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
})();
