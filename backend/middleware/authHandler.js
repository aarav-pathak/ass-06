const jwt = require("jsonwebtoken");

const auth_handler = (req, res, nxt) => {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No authentication token provided.",
      });
    }

    const tok = h.split(" ")[1];
    const sec = process.env.JWT_SECRET || "attendance_secret_key_12345";
    const u = jwt.verify(tok, sec);

    req.user = u;
    nxt();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = auth_handler;
