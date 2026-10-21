const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const make_token = (u) => {
  const sec = process.env.JWT_SECRET || "attendance_secret_key_12345";
  return jwt.sign(
    {
      id: u._id.toString(),
      role: u.role,
      name: u.name,
      email: u.email,
    },
    sec,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const register = async (req, res, nxt) => {
  try {
    const { name, email, password, role = "Student", rollNumber, semester, section } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const em = email.trim().toLowerCase();
    const ex_u = await User.findOne({ email: em });
    if (ex_u) {
      return res.status(409).json({
        message: "Email is already registered. Please log in.",
      });
    }

    let r = "Student";
    if (role === "Admin") {
      r = "Admin";
    }

    let roll_val = null;
    let sem_val = null;
    let sec_val = null;

    if (r === "Student") {
      if (!rollNumber || !semester || !section) {
        return res.status(400).json({
          message: "Students require roll number, semester (1-8), and section.",
        });
      }

      const roll_c = rollNumber.trim().toUpperCase();
      const ex_roll = await User.findOne({ rollNumber: roll_c });
      if (ex_roll) {
        return res.status(409).json({
          message: "Roll number " + rollNumber + " is already registered.",
        });
      }

      roll_val = roll_c;
      sem_val = Number(semester);
      sec_val = section.trim().toUpperCase();
    }

    const pwd = await bcrypt.hash(password, 10);

    const u = await User.create({
      name: name.trim(),
      email: em,
      password: pwd,
      role: r,
      rollNumber: roll_val,
      semester: sem_val,
      section: sec_val,
    });

    const tok = make_token(u);

    return res.status(201).json({
      message: "Registration successful",
      token: tok,
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        rollNumber: u.rollNumber,
        semester: u.semester,
        section: u.section,
      },
    });
  } catch (err) {
    nxt(err);
  }
};

const login = async (req, res, nxt) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const u = await User.findOne({ email: email.trim().toLowerCase() });
    if (!u) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const tok = make_token(u);

    return res.status(200).json({
      message: "Login successful",
      token: tok,
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        rollNumber: u.rollNumber,
        semester: u.semester,
        section: u.section,
      },
    });
  } catch (err) {
    nxt(err);
  }
};

const getMe = async (req, res, nxt) => {
  try {
    const u = await User.findById(req.user.id).select("-password");
    if (!u) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user: u });
  } catch (err) {
    nxt(err);
  }
};

module.exports = { register, login, getMe, get_me: getMe };
