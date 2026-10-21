const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Subject = require("./models/Subject");
const Attendance = require("./models/Attendance");

const seed_db = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dashly";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});

    const a_pwd = await bcrypt.hash("admin123", 10);
    const s_pwd = await bcrypt.hash("student123", 10);

    await User.create({
      name: "Prof. Arvind Rao (HOD)",
      email: "admin@college.edu",
      password: a_pwd,
      role: "Admin",
    });

    const std_list = [
      { name: "Aarav Sharma", email: "aarav@college.edu", rollNumber: "CS2301", semester: 3, section: "A" },
      { name: "Diya Kapoor", email: "diya@college.edu", rollNumber: "CS2302", semester: 3, section: "A" },
      { name: "Rohan Varma", email: "rohan@college.edu", rollNumber: "CS2303", semester: 3, section: "A" },
      { name: "Ananya Iyer", email: "ananya@college.edu", rollNumber: "CS2304", semester: 3, section: "A" },
      { name: "Kabir Mehta", email: "kabir@college.edu", rollNumber: "CS2305", semester: 3, section: "A" },
      { name: "Isha Nair", email: "isha@college.edu", rollNumber: "CS2306", semester: 3, section: "A" },
      { name: "Varun Malhotra", email: "varun@college.edu", rollNumber: "CS2307", semester: 3, section: "B" },
      { name: "Tanvi Gupta", email: "tanvi@college.edu", rollNumber: "CS2308", semester: 3, section: "B" },
      { name: "Devansh Patel", email: "devansh@college.edu", rollNumber: "CS2309", semester: 3, section: "B" },
      { name: "Meera Reddy", email: "meera@college.edu", rollNumber: "CS2310", semester: 3, section: "B" },
      { name: "Siddharth Das", email: "siddharth@college.edu", rollNumber: "CS2311", semester: 3, section: "B" },
      { name: "Kavya Joshi", email: "kavya@college.edu", rollNumber: "CS2312", semester: 3, section: "B" },
    ];

    const stds = await User.insertMany(
      std_list.map((s) => ({
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber,
        semester: s.semester,
        section: s.section,
        password: s_pwd,
        role: "Student",
      }))
    );

    const subs = await Subject.insertMany([
      { name: "Web Technology", code: "CS301", semester: 3, teacherName: "Dr. Anita Sen" },
      { name: "Data Structures & Algorithms", code: "CS302", semester: 3, teacherName: "Prof. Rajesh Kumar" },
      { name: "Database Management Systems", code: "CS303", semester: 3, teacherName: "Dr. Sneha Roy" },
      { name: "Operating Systems", code: "CS304", semester: 3, teacherName: "Prof. Vikram Verma" },
      { name: "Computer Networks", code: "CS305", semester: 3, teacherName: "Dr. Manoj Joshi" },
    ]);

    const dates = [
      "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13",
      "2026-10-14", "2026-10-15", "2026-10-18", "2026-10-19",
      new Date().toISOString().split("T")[0],
    ];

    const sheets = [];
    for (const sub of subs) {
      for (let di = 0; di < dates.length; di++) {
        const d = dates[di];
        const recs = stds.map((std, si) => {
          let st = "Present";
          if (si === 1) {
            if (di % 2 === 0) st = "Absent";
          } else if (si === 2) {
            if (di % 3 === 0) st = "Absent";
          } else if (si % 4 === 0 && di === 2) {
            st = "Absent";
          }
          return { student: std._id, status: st };
        });

        sheets.push({ subject: sub._id, date: d, records: recs });
      }
    }

    await Attendance.insertMany(sheets);

    console.log("Seeding completed successfully!");
    console.log("Admin: admin@college.edu / admin123");
    console.log("Student: aarav@college.edu / student123");
    console.log("Shortage Student: diya@college.edu / student123");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seed_db();
