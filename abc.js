// scripts/migrateAssigneesToSupportIds.js

const mongoose = require("mongoose");
const Ticket = require("./src/models/tickets");

async function migrate() {
  await mongoose.connect("mongodb://localhost:27017/your-db-name");

  const tickets = await Ticket.find({ assignees: { $exists: true } });

  for (const ticket of tickets) {
    ticket.supportIds = ticket.assignees;
    ticket.assignees = undefined;
    await ticket.save();
    console.log(`Migrated ticket ${ticket._id}`);
  }

  await mongoose.disconnect();
}

migrate().catch(console.error);
