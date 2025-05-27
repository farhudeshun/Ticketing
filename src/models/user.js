const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "support", "user"],
      default: "user",
      required: true,
    },
    assignedTickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: function () {
          return this.role === "support";
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.role !== "support") {
    this.assignedTickets = [];
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  const orderedObj = {
    _id: obj._id,
    email: obj.email,
    name: obj.name,
    role: obj.role,
  };

  if (obj.role === "support" || obj.role === "admin") {
    orderedObj.assignedTickets = obj.assignedTickets;
  }

  orderedObj.createdAt = obj.createdAt;
  orderedObj.updatedAt = obj.updatedAt;
  orderedObj.__v = obj.__v;

  return orderedObj;
};

module.exports = mongoose.model("User", userSchema);
