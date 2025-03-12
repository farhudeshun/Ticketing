const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    if (roles.includes(req.user.role)) {
      return next();
    }

    if (req.params.id && req.user.id === parseInt(req.params.id)) {
      return next();
    }

    return res.status(403).json({
      message: "Access Denied: You do not have the required permissions",
    });
  };
};

module.exports = checkRole;
