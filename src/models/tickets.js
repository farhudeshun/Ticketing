const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("./user");

const Ticket = sequelize.define("Ticket", {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: "Medium",
  },
  status: {
    type: DataTypes.ENUM("open", "in-progress", "closed"),
    defaultValue: "open",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supportId: {
    type: DataTypes.INTEGER,
    allowNull: true, // This field will be used when a ticket is assigned to support
  },
});

// Define associations
Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });
Ticket.belongsTo(User, { foreignKey: "supportId", as: "support" });

module.exports = Ticket;
