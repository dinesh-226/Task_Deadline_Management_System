const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, admin, updateProject);
router.delete("/:id", protect, admin, deleteProject);

module.exports = router;
