const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");

async function isLoggedIn(req, res, next) {
  // Log all headers to see what is being sent
  console.log("Request headers:", req.headers);

  // Check for the token in the expected header
  const token = req.header("jwt_key");
  if (!token) {
    console.error("No token provided in jwt_key header.");
    return res.status(401).send("Access denied");
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, config.get("jwt_key"));
    console.log("Decoded token payload:", decoded);

    // Find the user based on the decoded _id
    const user = await User.findOne({ where: { id: decoded._id } });
    if (!user) {
      console.error("User not found for token _id:", decoded._id);
      return res.status(401).send("User not found");
    }

    console.log("User found:", user);
    req.user = user;
    next();
  } catch (ex) {
    console.error("Token verification error:", ex);
    res.status(400).send("Invalid token");
  }
}

async function isAdmin(req, res, next) {
  if (!req.user) {
    console.error("User object missing in isAdmin middleware");
    return res.status(400).send("User not authenticated");
  }

  console.log("User isadmin value:", req.user.isadmin);
  if (!req.user.isadmin) {
    console.error("User is not an admin");
    return res.status(403).send("Access denied. Admins only");
  }

  next(); // Proceed to the route handler if user is an admin
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
