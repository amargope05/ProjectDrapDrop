const express = require("express");
const router = express.Router();
const PageLayout = require("../models/PageLayout");

router.post("/", async (req, res) => {
  try {
    const layout = new PageLayout(req.body);
    await layout.save();
    res.json(layout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const layouts = await PageLayout.find().sort({ createdAt: -1 });
    res.json(layouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const layout = await PageLayout.findById(req.params.id);
    if (!layout) return res.status(404).json({ error: "Not found" });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
