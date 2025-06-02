const mongoose = require("mongoose");
const Ticket = require("./src/models/tickets");
const User = require("./src/models/user");

mongoose.connect("mongodb://localhost:27017/ticketing", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createSampleTickets() {
  try {
    const user = await User.findOne({ role: "user" });
    const support = await User.findOne({ role: "support" });

    if (!user) {
      throw new Error("No user with role 'user' found.");
    }

    const tickets = [
      {
        title: "Login Issue",
        description: "I can't log into my account using my email.",
        status: "open", // ✅ matches schema enum
        priority: "medium",
        userId: user._id,
        supportId: null,
      },
      {
        title: "Payment Failure",
        description: "My payment did not go through for the premium plan.",
        status: "in-progress", // ✅ matches schema enum
        priority: "high",
        userId: user._id,
        supportId: support ? support._id : null,
      },
      {
        title: "Feature Request",
        description: "It would be great to have dark mode in the UI.",
        status: "closed", // ✅ matches schema enum
        priority: "low",
        userId: user._id,
        supportId: support ? support._id : null,
      },
    ];

    await Ticket.insertMany(tickets);
    console.log("Sample tickets inserted successfully!");
  } catch (error) {
    console.error("Error creating sample tickets:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

createSampleTickets();
