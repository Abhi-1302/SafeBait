const express = require("express");
const router = express.Router();
const { Campaign, Interaction } = require("../models");

// POST /api/landing/:id
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Missing token" });

  let interaction = await Interaction.findOne({ where: { token } });
  if (!interaction) {
    return res.status(404).json({ message: "Interaction not found" });
  }
  interaction.clicked = true;
  interaction.timestamp = new Date();
  await interaction.save();
  res.json({ message: "Interaction updated" });
});

module.exports = router;
