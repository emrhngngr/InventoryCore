const express = require("express");
const Task = require("../models/Task");
const Product = require("../models/Product");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  createActivityLogger,
} = require("../middlewares/activityLogMiddleware");
// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedAsset", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Get tasks assigned to a group
router.get("/group/:groupType", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.groupType,
      status: { $ne: "approved" },
    }).populate("assignedAsset", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group tasks" });
  }
});

// Create a new task (Admin only)
router.post(
  "/",
  authMiddleware,
  createActivityLogger("create", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }

      console.log("req.body.assignedAsset ==> ", req.body);
      const assignedProduct = await Product.findById(req.body.assignedAsset);
      let riskValue = 0;
      if (assignedProduct) {
        riskValue =
          parseInt(assignedProduct.privacyDegree) *
          parseInt(assignedProduct.criticalityDegree);
      }

      const newTask = new Task({
        ...req.body,
        createdBy: req.user.id,
        riskValue,
      });

      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Task creation error:", error);
      res.status(500).json({ message: "Error creating task" });
    }
  }
);

// Complete task (for group members)
router.put(
  "/complete/:id",
  authMiddleware,
  createActivityLogger("pending", "task"),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.assignedTo !== req.user.role) {
        return res.status(403).json({ message: "You are not authorized to complete this task" });
      }

      task.status = "reviewing";
      task.completionNote = req.body.completionNote;

      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  }
);
// Complete task (Admin)
router.put(
  "/complete-admin/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("completed", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const assignedProduct = await Product.findById(task.assignedAsset);

      if (!assignedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      assignedProduct.updatedAt = new Date();
      await assignedProduct.save();

      task.status = "approved";
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  }
);

// Approve task (Admin)
router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("completed", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.status !== "reviewing") {
        return res.status(400).json({ message: "Task is not in a state suitable for approval" });
      }

      const assignedProduct = await Product.findById(task.assignedAsset);

      if (!assignedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      assignedProduct.updatedAt = new Date();
      await assignedProduct.save();

      task.status = "approved";
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error approving task" });
    }
  }
);

// Send task back (Admin)
router.put(
  "/sendback/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("sendback", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.status !== "reviewing") {
        return res.status(400).json({ message: "Task is not eligible to be sent back" });
      }

      console.log("req.body ==> ", req.body);
      task.status = "pending";
      task.feedback = req.body.feedback || "Task needs to be revised.";

      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error sending task back" });
    }
  }
);

// Delete task (Admin)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("delete", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }

      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
    }
  }
);

// Update task (Admin)
// Update the task endpoint in tasks.js router
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(['admin']),
  createActivityLogger("update", "task"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission" });
      }

      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          assignedTo: req.body.assignedTo,
          status: req.body.status,
        },
        { new: true }
      ).populate("assignedAsset", "name");

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  }
);

module.exports = router;
