const express = require("express");
const router = express.Router();
const { Template } = require("../models");

// GET /api/templates
router.get("/", async (req, res) => {
  const templates = await Template.findAll();
  res.json(templates);
});

// POST /api/templates
router.post("/", async (req, res) => {
  const { name, category, subject, content } = req.body;
  const template = await Template.create({ name, category, subject, content });
  res.json(template);
});

module.exports = router;
