const allowRoles = (...roles) => {
  return (req, res, nxt) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to access this resource.",
      });
    }
    nxt();
  };
};

module.exports = { allowRoles, allow_roles: allowRoles };
