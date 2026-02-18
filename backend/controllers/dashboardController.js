const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {

    // ================= ADMIN DASHBOARD =================
    if (req.user.role === "admin") {

      const totalProjects = await Project.countDocuments();
      const totalTasks = await Task.countDocuments();
      //only active interns
      const totalInterns = await User.countDocuments({
        role: "intern",
        isOnline: true
      });
      const completedTasks = await Task.countDocuments({ status: "completed" });
      const pendingTasks = await Task.countDocuments({ status: "pending" });
      const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

      const recentTasks = await Task.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("assignedIntern", "name email");

      const recentProjects = await Project.find()
        .sort({ createdAt: -1 })
        .limit(5);

      const activeInterns = await User.find({
        role: "intern",
        isOnline: true
      }).select("name email");

      // GET INTERN FILE SUBMISSIONS
      const submittedTasks = await Task.find({
        "submittedFile.fileName": { $exists: true, $ne: "" }
      })
        .populate("assignedIntern", "name email")
        .sort({ updatedAt: -1 });

      return res.status(200).json({
        role: "admin",
        stats: {
          totalProjects,
          totalTasks,
          totalInterns,
          completedTasks,
          pendingTasks,
          inProgressTasks
        },
        recentTasks,
        recentProjects,
        submittedTasks,
        activeInterns,
        statusDistribution: {
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks
        }
      });
    }

    // ================= INTERN DASHBOARD =================
    if (req.user.role === "intern") {

      const myTasks = await Task.countDocuments({ assignedIntern: req.user._id });

      const completed = await Task.countDocuments({
        assignedIntern: req.user._id,
        status: "completed"
      });

      const pending = await Task.countDocuments({
        assignedIntern: req.user._id,
        status: "pending"
      });

      const inProgress = await Task.countDocuments({
        assignedIntern: req.user._id,
        status: "in-progress"
      });

      const myRecentTasks = await Task.find({
        assignedIntern: req.user._id
      })
        .sort({ createdAt: -1 })
        .limit(5);

      const upcomingDeadlines = await Task.find({
        assignedIntern: req.user._id,
        status: { $ne: "completed" }
      })
        .sort({ deadline: 1 })
        .limit(5);

      return res.status(200).json({
        role: "intern",
        stats: {
          myTasks,
          completed,
          pending,
          inProgress
        },
        myRecentTasks,
        upcomingDeadlines
      });
    }

  } catch (error) {
    console.log(error); // helps debugging
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = { getDashboardStats };