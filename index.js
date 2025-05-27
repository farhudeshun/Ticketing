require("dotenv").config();
const express = require("express");
const app = express();
const config = require("config");
const router = require("./src/routes/");
const mongoose = require("mongoose");

mongoose.set("debug", (coll, method, query) => {
  console.log(`Mongoose ${method} on ${coll}: ${JSON.stringify(query)}`);
});

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
