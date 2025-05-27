const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    primarySupportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to ensure assignees are support staff
ticketSchema.pre("save", async function (next) {
  if (this.isModified("assignees")) {
    const User = mongoose.model("User");
    const assignees = await User.find({
      _id: { $in: this.assignees },
      role: "support",
    });

    if (assignees.length !== this.assignees.length) {
      throw new Error("All assignees must be support staff");
    }
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
