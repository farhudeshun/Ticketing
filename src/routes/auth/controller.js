const controller = require("./../controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = new (class extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ where: { email: req.body.email } });
    if (user) {
      return this.response({
        res,
        code: 400,
        message: "This user is already registered",
      });
    }

    user = new this.User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    this.response({
      res,
      message: "The user was successfully registered",
      data: _.pick(user, ["_id", "name", "email"]),
    });
  }

  async login(req, res) {
    const user = await this.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: "Invalid email or password",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return this.response({
        res,
        code: 400,
        message: "Invalid email or password",
      });
    }

    // Generate token with the isadmin flag
    const token = jwt.sign(
      { _id: user.id, isadmin: user.isadmin },
      config.get("jwt_key")
    );

    this.response({
      res,
      message: "Successfully logged in",
      data: { token },
    });
  }
})();
