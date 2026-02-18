const express = require("express");
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
  updateTask,
  uploadTaskFile
} = require("../controllers/taskController");

const { protect, admin} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware")

const router = express.Router();

router.post("/", protect, admin, createTask);

router.get("/", protect, async (req, res) => {
  if (req.user.role === "admin") {
    return getAllTasks(req, res);
  } else {
    return getMyTasks(req, res);
  }
});
router.put("/:id", protect, admin, updateTask);
router.put("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, admin, deleteTask);
router.post("/:id/upload", protect, upload.single("file"), uploadTaskFile);


module.exports = router;
