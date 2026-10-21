const User = require("../models/User");

const get_students = async (req, res, nxt) => {
  try {
    let q = { role: "Student" };
    if (req.query.semester) {
      q.semester = Number(req.query.semester);
    }
    if (req.query.section) {
      q.section = req.query.section.trim().toUpperCase();
    }
    if (req.query.search) {
      let reg = new RegExp(req.query.search.trim(), "i");
      q.$or = [{ name: reg }, { rollNumber: reg }, { email: reg }];
    }
    const stds = await User.find(q)
      .select("_id name email rollNumber semester section createdAt")
      .sort({ rollNumber: 1, name: 1 });

    return res.status(200).json({ count: stds.length, students: stds });
  } catch (err) {
    nxt(err);
  }
};

const get_student_by_id = async (req, res, nxt) => {
  try {
    const std = await User.findOne({
      _id: req.params.id,
      role: "Student",
    }).select("_id name email rollNumber semester section createdAt");

    if (!std) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.status(200).json({ student: std });
  } catch (err) {
    nxt(err);
  }
};

module.exports = {
  getAllStudents: get_students,
  getStudentById: get_student_by_id,
  getStudentsBySemester: get_students,
  get_students,
  get_student_by_id,
};
