const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authHandler = require("../middleware/authHandler");
const { allowRoles } = require("../middleware/roleHandler");

router.use(authHandler);
router.use(allowRoles("Admin"));

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);

module.exports = router;
