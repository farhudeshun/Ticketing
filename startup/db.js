const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    });
};
