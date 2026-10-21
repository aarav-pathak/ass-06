const mongoose = require("mongoose");

const sub_schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    teacherName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", sub_schema);
