const error_handler = (err, req, res, nxt) => {
  let status = err.statusCode || 500;
  let msg = err.message || "Internal server error";

  if (err.name === "CastError") {
    status = 400;
    msg = "Invalid ID format: " + err.value;
  }

  if (err.name === "ValidationError") {
    status = 400;
    msg = Object.values(err.errors)
      .map((it) => it.message)
      .join(", ");
  }

  if (err.code === 11000) {
    status = 409;
    const f = Object.keys(err.keyValue || {})[0] || "field";
    msg = "Duplicate value entered for " + f + ".";
  }

  return res.status(status).json({ message: msg });
};

module.exports = error_handler;
