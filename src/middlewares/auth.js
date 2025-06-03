const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
async function isLoggedIn(req, res, next) {
  console.log("Request headers:", req.headers);

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.error("No Authorization header provided.");
    return res.status(401).send("Access denied");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, config.get("jwt_key"));
    console.log("Decoded token payload:", decoded);

    const user = await User.findById(decoded._id);
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

  console.log("User role:", req.user.role);
  if (req.user.role !== "admin") {
    console.error("User is not an admin");
    return res.status(403).send("Access denied. Admins only");
  }

  next();
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
