const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authHandler = require("../middleware/authHandler");
const { allowRoles } = require("../middleware/roleHandler");

router.use(authHandler);

router.get("/my-summary", allowRoles("Student"), attendanceController.getStudentSummary);
router.get("/my-detail/:subjectId", allowRoles("Student"), attendanceController.getStudentSubjectDetail);

router.get("/sheet", allowRoles("Admin"), attendanceController.getAttendanceSheet);
router.post("/", allowRoles("Admin"), attendanceController.markOrUpdateAttendance);
router.get("/shortage", allowRoles("Admin"), attendanceController.getShortageList);
router.get("/dashboard", allowRoles("Admin"), attendanceController.getDashboardStats);

module.exports = router;
