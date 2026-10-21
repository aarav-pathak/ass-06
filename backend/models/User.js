const mongoose = require("mongoose");

const user_schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["Admin", "Student"], default: "Student" },
    rollNumber: { type: String, trim: true, uppercase: true, default: null },
    semester: { type: Number, min: 1, max: 8, default: null },
    section: { type: String, trim: true, uppercase: true, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", user_schema);
