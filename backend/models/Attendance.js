const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"]
        },
        status: {
            type: String,
            enum: ["Present", "Absent"],
            required: [true, "Status is required"],
            default: "Present"
        }
    },
    { _id: false }
);

const attendanceSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: [true, "Subject is required"]
        },
        date: {
            type: String,
            required: [true, "Date is required"],
            trim: true
        },
        records: [attendanceRecordSchema]
    },
    {
        timestamps: true
    }
);

attendanceSchema.index({ subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
