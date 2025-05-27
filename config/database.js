const mongoose = require("mongoose");
const logger = require("winston");

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("✅ MongoDB connected successfully!");
  } catch (err) {
    logger.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
