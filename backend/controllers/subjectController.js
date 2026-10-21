const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");

const get_subjects = async (req, res, nxt) => {
  try {
    let q = {};
    if (req.query.semester) {
      q.semester = Number(req.query.semester);
    }
    const subs = await Subject.find(q).sort({ semester: 1, name: 1 });
    return res.status(200).json({ count: subs.length, subjects: subs });
  } catch (err) {
    nxt(err);
  }
};

const get_subject_by_id = async (req, res, nxt) => {
  try {
    const sub = await Subject.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Subject not found." });
    }
    return res.status(200).json({ subject: sub });
  } catch (err) {
    nxt(err);
  }
};

const create_subject = async (req, res, nxt) => {
  try {
    const { name, code, semester, teacherName } = req.body;
    if (!name || !code || !semester || !teacherName) {
      return res.status(400).json({
        message: "All fields are required: name, code, semester, teacherName.",
      });
    }

    const c_code = code.trim().toUpperCase();
    const ex = await Subject.findOne({ code: c_code });
    if (ex) {
      return res.status(409).json({
        message: "Subject code " + c_code + " is already taken.",
      });
    }

    const sub = await Subject.create({
      name: name.trim(),
      code: c_code,
      semester: Number(semester),
      teacherName: teacherName.trim(),
    });

    return res.status(201).json({
      message: "Subject created successfully.",
      subject: sub,
    });
  } catch (err) {
    nxt(err);
  }
};

const update_subject = async (req, res, nxt) => {
  try {
    const { name, code, semester, teacherName } = req.body;
    const sub = await Subject.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Subject not found." });
    }

    if (code) {
      const c_code = code.trim().toUpperCase();
      const ex = await Subject.findOne({
        code: c_code,
        _id: { $ne: req.params.id },
      });
      if (ex) {
        return res.status(409).json({
          message: "Subject code " + c_code + " is already in use.",
        });
      }
      sub.code = c_code;
    }

    if (name) sub.name = name.trim();
    if (semester) sub.semester = Number(semester);
    if (teacherName) sub.teacherName = teacherName.trim();

    await sub.save();

    return res.status(200).json({
      message: "Subject updated successfully.",
      subject: sub,
    });
  } catch (err) {
    nxt(err);
  }
};

const delete_subject = async (req, res, nxt) => {
  try {
    const sub = await Subject.findByIdAndDelete(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Subject not found." });
    }

    await Attendance.deleteMany({ subject: req.params.id });

    return res.status(200).json({
      message: "Subject and related attendance records deleted successfully.",
    });
  } catch (err) {
    nxt(err);
  }
};

module.exports = {
  getAllSubjects: get_subjects,
  getSubjectById: get_subject_by_id,
  createSubject: create_subject,
  updateSubject: update_subject,
  deleteSubject: delete_subject,
  get_subjects,
  get_subject_by_id,
  create_subject,
  update_subject,
  delete_subject,
};
