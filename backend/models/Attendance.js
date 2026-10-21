const mongoose = require("mongoose");

const rec_schema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Present", "Absent"], default: "Present" },
  },
  { _id: false }
);

const att_schema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: String, required: true, trim: true },
    records: [rec_schema],
  },
  { timestamps: true }
);

att_schema.index({ subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", att_schema);
