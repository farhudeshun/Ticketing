const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "support", "user"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
