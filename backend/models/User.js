const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        role: {
            type: String,
            enum: ["Admin", "Student"],
            default: "Student"
        },
        rollNumber: {
            type: String,
            trim: true,
            uppercase: true,
            default: null
        },
        semester: {
            type: Number,
            min: 1,
            max: 8,
            default: null
        },
        section: {
            type: String,
            trim: true,
            uppercase: true,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
