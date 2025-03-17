const controller = require("../controller");
const User = require("../../models/user");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.send("admin dashboard");
  }

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      console.log("Received request to update role:", { id, role });

      if (!role || !["admin", "support", "user"].includes(role)) {
        console.log("Invalid role detected");
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id === req.user.id) {
        console.log("User attempted to change their own role");
        return res
          .status(403)
          .json({ message: "You cannot change your own role" });
      }

      if (user.role === role) {
        console.log(`User already has the role: ${role}`);
        return res
          .status(400)
          .json({ message: `User already has the ${role} role` });
      }

      console.log("Updating user role...");
      user.role = role;
      await user.save();

      console.log("User role updated successfully, sending response...");
      return res.status(200).json({
        message: `User role updated to ${user.role}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
