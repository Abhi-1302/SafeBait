const express = require("express");
const router = express.Router();
const {
  User,
  Campaign,
  Template,
  Audience,
  Interaction,
} = require("../models");
const authenticateAdmin = require("../middlewares/authAdmin");
const authenticate = require("../middlewares/auth");

const adminAuth = [authenticate, authenticateAdmin];

// GET /api/admin/stats - get platform stats
router.get("/stats", adminAuth, async (req, res) => {
  const [users, campaigns, audiences, templates] = await Promise.all([
    User.findAll({ attributes: ["id", "email"] }),
    Campaign.findAll({ attributes: ["id", "userId"] }),
    Audience.findAll({ attributes: ["id", "userId"] }),
    Template.count(),
  ]);

  const campaignCounts = {};
  const audienceCounts = {};
  users.forEach((user) => {
    campaignCounts[user.email] = campaigns.filter(
      (c) => c.userId === user.id
    ).length;
    audienceCounts[user.email] = audiences.filter(
      (a) => a.userId === user.id
    ).length;
  });

  const totalInteractions = await Interaction.count();
  const clicked = await Interaction.count({ where: { clicked: true } });
  const reported = await Interaction.count({ where: { reported: true } });

  res.json({
    userCount: users.length,
    campaignCount: campaigns.length,
    audienceCount: audiences.length,
    templateCount: templates,
    campaignCounts,
    audienceCounts,
    totalInteractions,
    clicked,
    reported,
  });
});

router.get("/templates", adminAuth, async (req, res) => {
  try {
    const templates = await Template.findAll();
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const banner = `<div style="background:#fff3cd;padding:12px;border-radius:6px;margin-bottom:18px;font-size:16px;">
<b>Suspicious?</b> <a href="{{reportLink}}" style="color:#d32f2f;font-weight:bold">Report this as Phishing</a>
</div>`;

const hasValidBanner = (content) => content.startsWith(banner);
const hasOneLinkAnchor = (content) =>
  (content.match(/<a href="{{link}}">/g) || []).length === 1;

// Create new template
router.post("/templates", adminAuth, async (req, res) => {
  const { name, category, subject, content } = req.body;
  if (!hasValidBanner(content)) {
    return res
      .status(400)
      .json({ message: "Content must start with the predefined banner." });
  }
  if (!hasOneLinkAnchor(content)) {
    return res.status(400).json({
      message: 'Content must contain exactly one <a href="{{link}}"> tag.',
    });
  }
  try {
    const tpl = await Template.create({ name, category, subject, content });
    res.json(tpl);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update existing template
router.put("/templates/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, category, subject, content } = req.body;
  if (!hasValidBanner(content)) {
    return res
      .status(400)
      .json({ message: "Content must start with the predefined banner." });
  }
  if (!hasOneLinkAnchor(content)) {
    return res.status(400).json({
      message: 'Content must contain exactly one <a href="{{link}}"> tag.',
    });
  }
  try {
    const tpl = await Template.findByPk(id);
    if (!tpl) return res.status(404).json({ message: "Template not found" });
    tpl.name = name;
    tpl.category = category;
    tpl.subject = subject;
    tpl.content = content;
    await tpl.save();
    res.json(tpl);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users - list users for admin
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "email", "isAdmin"] });
  res.json(users);
});

// PUT /api/admin/users/:id - update admin rights
router.put("/users/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isAdmin = isAdmin;
  await user.save();

  res.json({ message: "User updated" });
});

module.exports = router;
