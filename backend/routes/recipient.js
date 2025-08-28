const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { Recipient, Audience } = require("../models");

// POST /api/recipients
router.post("/", authenticate, async (req, res) => {
  try {
    const { audienceId, email, name } = req.body;

    if (!audienceId || !email) {
      return res
        .status(400)
        .json({ message: "audienceId and email are required" });
    }

    const audience = await Audience.findOne({
      where: { id: audienceId, userId: req.userId },
    });
    if (!audience) {
      return res
        .status(403)
        .json({ message: "Invalid audience or access denied" });
    }

    const recipient = await Recipient.create({
      audienceId,
      email,
      name: name || "",
    });

    res.status(201).json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add recipient" });
  }
});

// DELETE /api/recipients/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    // Correctly include the associated Audience to get its userId
    const recipient = await Recipient.findByPk(id, {
      include: [{ model: Audience }],
    });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    if (!recipient.audience) {
      // This means audience association not found, handle gracefully
      return res
        .status(400)
        .json({ message: "Recipient does not belong to any audience" });
    }

    if (recipient.audience.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await recipient.destroy();
    res.json({ message: "Recipient deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete recipient" });
  }
});

module.exports = router;
