const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

let cors_origin = true;
if (process.env.NODE_ENV === "production" && process.env.CLIENT_URL) {
    cors_origin = process.env.CLIENT_URL;
}

app.use(cors({
    origin: cors_origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (request, response) => {
    response.status(200).json({
        message: "Class Attendance API is running",
        status: "Success",
        version: "1.0.0"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use((request, response) => {
    response.status(404).json({
        message: "Endpoint " + request.method + " " + request.originalUrl + " not found."
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server listening on port " + PORT);
    });
}).catch((error) => {
    console.error("Failed to start server due to DB connection error:", error.message);
});
