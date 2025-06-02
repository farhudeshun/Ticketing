const User = require("../../models/user");
const controller = require("./../controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.json({
      message: "User Dashboard",
      user: req.user,
    });
  }

  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // The toJSON method will automatically handle hiding assignedTickets for non-support users
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { name, email, password } = req.body;

      const updateData = { name, email };

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        message: "Error updating user profile",
        error: error.message,
      });
    }
  }

  async adminUpdateUser(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = req.params.userId;
      const { name, email, role, assignedTickets } = req.body;

      const updateData = _.pickBy(
        { name, email, role, assignedTickets },
        _.identity
      );

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  }

  async adminGetAllUsers(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await User.find({});
      res.json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        message: "Error fetching users",
        error: error.message,
      });
    }
  }

  async adminDeleteUser(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  }

  async getMyTickets(req, res) {
    try {
      const tickets = await req.user.getRelevantTickets();
      res.json({
        message: "Tickets retrieved successfully",
        tickets,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({
        message: "Error fetching tickets",
        error: error.message,
      });
    }
  }

  async getSupportWorkload(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only admins can view support workload",
        });
      }

      const workload = await User.getSupportWorkload();
      res.json({
        message: "Support workload retrieved successfully",
        workload,
      });
    } catch (error) {
      console.error("Error fetching support workload:", error);
      res.status(500).json({
        message: "Error fetching support workload",
        error: error.message,
      });
    }
  }
})();
