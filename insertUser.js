const mongoose = require("mongoose");
const User = require("./src/models/user");

mongoose.connect("mongodb://localhost:27017/ticketing", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createUser() {
  try {
    const newUser = new User({
      email: "support@support.com",
      name: "naghi",
      password: "naghi",
      role: "support",
    });

    await newUser.save();
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    mongoose.disconnect();
  }
}

createUser();
