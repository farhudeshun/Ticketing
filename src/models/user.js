const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isadmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: true, // Equivalent to mongoose-timestamp plugin
  }
);

module.exports = User;
