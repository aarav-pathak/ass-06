const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const authHandler = require("../middleware/authHandler");
const { allowRoles } = require("../middleware/roleHandler");

router.use(authHandler);

router.get("/", subjectController.getAllSubjects);
router.get("/:id", subjectController.getSubjectById);
router.post("/", allowRoles("Admin"), subjectController.createSubject);
router.put("/:id", allowRoles("Admin"), subjectController.updateSubject);
router.delete("/:id", allowRoles("Admin"), subjectController.deleteSubject);

module.exports = router;
