const sequelize = require("../../config/database");
const User = require("./user");
const Ticket = require("./tickets");

// Define relationships here
User.hasMany(Ticket, { foreignKey: "userId" });
Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { sequelize, User, Ticket };
