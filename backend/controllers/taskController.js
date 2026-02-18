const Task = require("../models/Task");

// Create Task (Admin Only)
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      deadline,
      assignedIntern,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assignedIntern,
      project,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks (Admin)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedIntern", "name email")
      .populate("project", "name");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Tasks (Intern)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedIntern: req.user._id })
      .populate("project", "name");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status (Intern)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only assigned intern can update
    if (task.assignedIntern.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task (Admin Only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task (Admin Only)
exports.updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      deadline,
      assignedIntern,
      project,
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title;
    task.description = description;
    task.priority = priority;
    task.deadline = deadline;
    task.assignedIntern = assignedIntern;
    task.project = project;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Upload Task Submission (Intern Only)
exports.uploadTaskFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    // Save file info
    task.submittedFile = {
      fileName: req.file.orignalname,
      filePath: req.file.name,
      uploadedAt: new Date()
    };

    task.submittedBy = req.user.id;
    task.status = "completed";

    await task.save();

    res.json({ message: "File uploaded successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
