const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const User = require("../models/User");

const calc_need = (att, tot) => {
  if (tot === 0 || (att / tot) * 100 >= 75) {
    return 0;
  }
  return Math.max(0, Math.ceil(3 * tot - 4 * att));
};

const get_sheet = async (req, res, nxt) => {
  try {
    const { subjectId, date } = req.query;
    if (!subjectId || !date) {
      return res.status(400).json({ message: "subjectId and date are required." });
    }

    const sub = await Subject.findById(subjectId);
    if (!sub) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const ex = await Attendance.findOne({ subject: subjectId, date: date }).populate(
      "records.student",
      "name rollNumber section"
    );

    if (ex) {
      return res.status(200).json({
        exists: true,
        subject: sub,
        date: date,
        records: ex.records.map((r) => {
          let s_id = null;
          let s_name = "Student";
          let s_roll = "N/A";
          let s_sec = "N/A";
          if (r.student) {
            s_id = r.student._id;
            s_name = r.student.name;
            s_roll = r.student.rollNumber;
            s_sec = r.student.section;
          }
          return {
            studentId: s_id,
            name: s_name,
            rollNumber: s_roll,
            section: s_sec,
            status: r.status,
          };
        }),
      });
    }

    const stds = await User.find({ role: "Student", semester: sub.semester }).sort({
      rollNumber: 1,
      name: 1,
    });

    return res.status(200).json({
      exists: false,
      subject: sub,
      date: date,
      records: stds.map((s) => ({
        studentId: s._id,
        name: s.name,
        rollNumber: s.rollNumber,
        section: s.section,
        status: "Present",
      })),
    });
  } catch (err) {
    nxt(err);
  }
};

const mark_att = async (req, res, nxt) => {
  try {
    const { subjectId, date, records } = req.body;
    if (!subjectId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "subjectId, date, and records array are required." });
    }

    const recs = records.map((r) => ({
      student: r.studentId,
      status: r.status,
    }));

    const saved = await Attendance.findOneAndUpdate(
      { subject: subjectId, date: date.trim() },
      { subject: subjectId, date: date.trim(), records: recs },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Attendance saved successfully.",
      attendance: saved,
    });
  } catch (err) {
    nxt(err);
  }
};

const get_summary = async (req, res, nxt) => {
  try {
    const std = await User.findById(req.user.id);
    if (!std) {
      return res.status(404).json({ message: "Student not found." });
    }

    const subs = await Subject.find({ semester: std.semester }).sort({ name: 1 });
    const sheets = await Attendance.find({ "records.student": std._id });

    let g_tot = 0;
    let g_att = 0;

    const list = subs.map((sub) => {
      const sub_sheets = sheets.filter((s) => s.subject.toString() === sub._id.toString());
      const tot = sub_sheets.length;
      let att = 0;

      sub_sheets.forEach((s) => {
        const found = s.records.find(
          (r) => r.student && r.student.toString() === std._id.toString()
        );
        if (found && found.status === "Present") {
          att = att + 1;
        }
      });

      g_tot = g_tot + tot;
      g_att = g_att + att;

      let pct = 100;
      if (tot > 0) {
        pct = Number(((att / tot) * 100).toFixed(1));
      }

      return {
        subjectId: sub._id,
        name: sub.name,
        code: sub.code,
        teacherName: sub.teacherName,
        semester: sub.semester,
        totalClasses: tot,
        attendedClasses: att,
        percentage: pct,
        isShortage: pct < 75 && tot > 0,
        classesNeeded: calc_need(att, tot),
      };
    });

    let overall_pct = 100;
    if (g_tot > 0) {
      overall_pct = Number(((g_att / g_tot) * 100).toFixed(1));
    }

    return res.status(200).json({
      student: {
        name: std.name,
        rollNumber: std.rollNumber,
        semester: std.semester,
        section: std.section,
      },
      overall: {
        totalClasses: g_tot,
        attendedClasses: g_att,
        overallPercentage: overall_pct,
        isShortage: overall_pct < 75 && g_tot > 0,
      },
      subjects: list,
    });
  } catch (err) {
    nxt(err);
  }
};

const get_detail = async (req, res, nxt) => {
  try {
    const { subjectId } = req.params;
    const sub = await Subject.findById(subjectId);
    if (!sub) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const sheets = await Attendance.find({
      subject: subjectId,
      "records.student": req.user.id,
    }).sort({ date: -1 });

    let att = 0;
    const hist = [];

    sheets.forEach((s) => {
      const found = s.records.find(
        (r) => r.student && r.student.toString() === req.user.id
      );
      if (found) {
        if (found.status === "Present") {
          att = att + 1;
        }
        hist.push({ date: s.date, status: found.status });
      }
    });

    const tot = hist.length;
    let pct = 100;
    if (tot > 0) {
      pct = Number(((att / tot) * 100).toFixed(1));
    }

    return res.status(200).json({
      subject: {
        id: sub._id,
        name: sub.name,
        code: sub.code,
        semester: sub.semester,
        teacherName: sub.teacherName,
      },
      stats: {
        totalClasses: tot,
        attendedClasses: att,
        percentage: pct,
        isShortage: pct < 75 && tot > 0,
        classesNeeded: calc_need(att, tot),
      },
      history: hist,
    });
  } catch (err) {
    nxt(err);
  }
};

const get_shortage = async (req, res, nxt) => {
  try {
    const { semester, subjectId } = req.query;
    let sub_q = {};
    if (subjectId) {
      sub_q._id = subjectId;
    }
    if (semester) {
      sub_q.semester = Number(semester);
    }

    const subs = await Subject.find(sub_q).sort({ semester: 1, name: 1 });
    const stds = await User.find({ role: "Student" }).sort({ rollNumber: 1 });
    const sheets = await Attendance.find();

    const shortages = [];

    subs.forEach((sub) => {
      const sub_sheets = sheets.filter((s) => s.subject.toString() === sub._id.toString());
      const tot = sub_sheets.length;
      if (tot === 0) return;

      const sem_stds = stds.filter((s) => s.semester === sub.semester);

      sem_stds.forEach((s) => {
        let att = 0;
        sub_sheets.forEach((sheet) => {
          const found = sheet.records.find(
            (r) => r.student && r.student.toString() === s._id.toString()
          );
          if (found && found.status === "Present") {
            att = att + 1;
          }
        });

        const pct = Number(((att / tot) * 100).toFixed(1));
        if (pct < 75) {
          shortages.push({
            studentId: s._id,
            studentName: s.name,
            rollNumber: s.rollNumber,
            semester: s.semester,
            section: s.section,
            subjectId: sub._id,
            subjectName: sub.name,
            subjectCode: sub.code,
            teacherName: sub.teacherName,
            totalClasses: tot,
            attendedClasses: att,
            percentage: pct,
            classesNeeded: calc_need(att, tot),
          });
        }
      });
    });

    return res.status(200).json({ count: shortages.length, shortages: shortages });
  } catch (err) {
    nxt(err);
  }
};

const get_stats = async (req, res, nxt) => {
  try {
    const tot_std = await User.countDocuments({ role: "Student" });
    const tot_sub = await Subject.countDocuments();
    const sheets = await Attendance.find();
    const subs = await Subject.find().sort({ semester: 1, name: 1 });
    const stds = await User.find({ role: "Student" });

    const today = new Date().toISOString().split("T")[0];
    const today_sheets = sheets.filter((s) => s.date === today);

    let t_marks = 0;
    let t_pres = 0;
    today_sheets.forEach((s) => {
      s.records.forEach((r) => {
        t_marks = t_marks + 1;
        if (r.status === "Present") {
          t_pres = t_pres + 1;
        }
      });
    });

    let today_pct = 0;
    if (t_marks > 0) {
      today_pct = Number(((t_pres / t_marks) * 100).toFixed(1));
    }

    const shortage_ids = new Set();

    const sub_stats = subs.map((sub) => {
      const sub_sheets = sheets.filter((s) => s.subject.toString() === sub._id.toString());
      const tot = sub_sheets.length;
      const sem_stds = stds.filter((s) => s.semester === sub.semester);

      let marks = 0;
      let pres = 0;
      let count = 0;

      sem_stds.forEach((s) => {
        let att = 0;
        sub_sheets.forEach((sheet) => {
          const found = sheet.records.find(
            (r) => r.student && r.student.toString() === s._id.toString()
          );
          if (found) {
            marks = marks + 1;
            if (found.status === "Present") {
              pres = pres + 1;
              att = att + 1;
            }
          }
        });

        if (tot > 0 && (att / tot) * 100 < 75) {
          count = count + 1;
          shortage_ids.add(s._id.toString());
        }
      });

      let avg_pct = 0;
      if (marks > 0) {
        avg_pct = Number(((pres / marks) * 100).toFixed(1));
      }

      return {
        id: sub._id,
        name: sub.name,
        code: sub.code,
        semester: sub.semester,
        teacherName: sub.teacherName,
        totalClasses: tot,
        avgPercentage: avg_pct,
        shortageCount: count,
      };
    });

    return res.status(200).json({
      todayDate: today,
      todaySessions: today_sheets.length,
      todayPercentage: today_pct,
      totalStudents: tot_std,
      totalSubjects: tot_sub,
      totalAttendanceSessions: sheets.length,
      shortageStudentCount: shortage_ids.size,
      subjectStats: sub_stats,
    });
  } catch (err) {
    nxt(err);
  }
};

module.exports = {
  getAttendanceSheet: get_sheet,
  markOrUpdateAttendance: mark_att,
  getStudentSummary: get_summary,
  getStudentSubjectDetail: get_detail,
  getShortageList: get_shortage,
  getDashboardStats: get_stats,
  get_sheet,
  mark_att,
  get_summary,
  get_detail,
  get_shortage,
  get_stats,
};
