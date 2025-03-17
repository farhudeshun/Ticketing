const { User } = require("../../models/user");
const controller = require("./../controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.json({
      message: "User Dashboard",
      user: _.pick(req.user, ["id", "name", "email"]),
    });
  }

  async me(req, res) {
    try {
      const userId = req.params.id || req.user?.id;

      const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "password"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      this.response({
        res,
        data: _.pick(user, ["id", "name", "email", "password"]),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  }
})();
