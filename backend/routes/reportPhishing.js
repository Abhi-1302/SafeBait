const express = require("express");
const router = express.Router();
const { Interaction } = require("../models");

// POST /api/reportPhishing/:id
router.post("/:id", async (req, res) => {
  const { token } = req.body;
  const { id } = req.params;
  if (!token) return res.status(400).json({ message: "Missing token" });

  let interaction = await Interaction.findOne({
    where: { campaignId: id, token: token },
  });

  if (interaction) {
    interaction.reported = true;
    interaction.reportedAt = new Date();
    await interaction.save();
    return res.json({ message: "Interaction updated (reported)" });
  }
  res.status(404).json({ message: "Interaction not found" });
});

module.exports = router;
