const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { Audience, Recipient, User } = require("../models");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");

// GET /api/audiences
router.get("/", authenticate, async (req, res) => {
  const audiences = await Audience.findAll({
    where: { userId: req.userId },
    include: [{ model: Recipient }],
  });
  res.json(audiences);
});

// POST /api/audiences
router.post("/", authenticate, async (req, res) => {
  const { name, description } = req.body;
  const audience = await Audience.create({
    name,
    description,
    userId: req.userId,
  });
  res.json(audience);
});

const upload = multer({ storage: multer.memoryStorage() });
// Upload recipients CSV for a specific audience
router.post(
  "/:id/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const recipients = [];

    // Convert buffer to stream using streamifier
    streamifier
      .createReadStream(req.file.buffer)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.email) {
          recipients.push({
            email: row.email.trim(),
            name: row.name ? row.name.trim() : "",
            audienceId: id,
          });
        }
      })
      .on("end", async () => {
        try {
          await Recipient.bulkCreate(recipients, { ignoreDuplicates: true });
          res.json({ added: recipients.length });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to save recipients" });
        }
      })
      .on("error", (err) => {
        console.error(err);
        res.status(400).json({ message: "Error parsing CSV file" });
      });
  }
);

// GET /api/audiences/:id
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const audienceId = parseInt(id, 10);
  if (isNaN(audienceId)) {
    return res.status(400).json({ message: "Invalid audience ID" });
  }

  const audience = await Audience.findOne({
    where: { id: audienceId, userId: req.userId },
    include: [{ model: Recipient }],
  });

  if (!audience) {
    return res.status(404).json({ message: "Audience not found" });
  }

  res.json(audience);
});

//DELETE /api/audiences/:id
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const audienceId = parseInt(id, 10);
  if (isNaN(audienceId)) {
    return res.status(400).json({ message: "Invalid audience ID" });
  }

  const audience = await Audience.findOne({
    where: { id: audienceId, userId: req.userId },
  });

  if (!audience) {
    return res.status(404).json({ message: "Audience not found" });
  }

  await audience.destroy();
  res.json({ message: "Audience deleted successfully" });
});

module.exports = router;
