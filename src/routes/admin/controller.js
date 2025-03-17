const controller = require("../controller");
const User = require("../../models/user");

module.exports = new (class extends controller {
  // Admin Dashboard (existing method)
  async dashboard(req, res) {
    res.send("admin dashboard");
  }

  // Admin-only: Update the role of a user
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body; // The new role to assign to the user

      // Validate the role
      if (!role || !["admin", "support", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Check if the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id === req.user.id) {
        return res
          .status(403)
          .json({ message: "You cannot change your own role" });
      }

      // Update the user's role and return the updated user data
      const [rowsUpdated, updatedRows] = await User.update(
        { role },
        {
          where: { id },
          returning: true, // PostgreSQL feature to return the updated rows
        }
      );

      if (rowsUpdated === 0) {
        return res.status(400).json({ message: "Role update failed" });
      }

      const updatedUser = updatedRows[0];

      return res.status(200).json({
        message: `User role updated to ${updatedUser.role}`,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res
        .status(500)
        .json({ message: "Error updating user role", error: error.message });
    }
  }
})();
