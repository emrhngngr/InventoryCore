const express = require("express");
const Task = require("../models/Task");
const Product = require("../models/Product");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const router = express.Router();

// Tüm görevleri getir (Admin için)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Görevler getirilirken hata oluştu" });
  }
});

// Gruba atanan görevleri getir
router.get("/group/:groupType", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.groupType,
      status: { $ne: "approved" },
    }).populate("createdBy", "name");
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Grup görevleri getirilirken hata oluştu" });
  }
});

// Yeni görev oluştur (Admin için)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz bulunmamaktadır" });
    }

    // Get the assigned product
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
    res.status(500).json({ message: "Görev oluşturulurken hata oluştu" });
  }
});

// Görevi tamamla (Grup üyeleri için)
router.put("/complete/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    if (task.assignedTo !== req.user.role) {
      return res
        .status(403)
        .json({ message: "Bu görevi tamamlama yetkiniz yok" });
    }

    task.status = "reviewing";
    task.completionNote = req.body.completionNote;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev güncellenirken hata oluştu" });
  }
});

// Görevi onayla (Admin için)
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz bulunmamaktadır" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    if (task.status !== "reviewing") {
      return res
        .status(400)
        .json({ message: "Görev onay için uygun durumda değil" });
    }

    task.status = "approved";
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev onaylanırken hata oluştu" });
  }
});

// Görevi geri gönder (Admin için)
router.put("/sendback/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz bulunmamaktadır" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    if (task.status !== "reviewing") {
      return res
        .status(400)
        .json({ message: "Görev geri gönderilmek için uygun değil" });
    }

    task.status = "pending";
    task.feedback = req.body.feedback || "Görev yeniden düzenlenmelidir.";

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev geri gönderilirken hata oluştu" });
  }
});

// Görevi sil (Admin için)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz bulunmamaktadır" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    res.json({ message: "Görev başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Görev silinirken hata oluştu" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz bulunmamaktadır" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        assignedTo: req.body.assignedTo,
        status: req.body.status,
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Görev güncellenirken hata oluştu" });
  }
});

module.exports = router;