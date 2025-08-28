const express = require("express");
const { sendMail } = require("../utils/mailer");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { Op } = require("sequelize");
const {
  Campaign,
  Audience,
  Template,
  Recipient,
  Interaction,
  User,
} = require("../models");

// GET /api/campaigns
router.get("/", authenticate, async (req, res) => {
  const campaigns = await Campaign.findAll({
    where: { userId: req.userId },
    include: [
      { model: Audience, attributes: ["name", "id"] },
      { model: Template, attributes: ["name", "subject"] },
      { model: Interaction },
    ],
  });

  const resp = campaigns.map((camp) => ({
    id: camp.id,
    name: camp.name,
    status: camp.status,
    totalSent: camp.interactions?.length ?? 0,
    totalOpened: camp.interactions?.length ?? 0,
    totalClicked: camp.interactions?.filter((i) => i.clicked).length ?? 0,
    template: camp.template || undefined,
    audience: camp.audience || undefined,
    createdAt: camp.createdAt,
  }));
  res.json(resp);
});

// POST /api/campaigns
router.post("/", authenticate, async (req, res) => {
  const { name, audienceId, templateId } = req.body;
  const campaign = await Campaign.create({
    name,
    audienceId,
    templateId,
    userId: req.userId,
    status: "active",
  });
  res.json({ campaign });
});

// GET /api/campaigns/:id
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findOne({
    where: { id, userId: req.userId },
    include: [
      { model: Audience, attributes: ["name"], include: { model: Recipient } },
      { model: Template, attributes: ["name", "subject"] },
      { model: Interaction },
    ],
  });
  if (!campaign) return res.status(200).json({ message: "Not found" });
  const totalInteractions = (campaign.interactions || []).length;
  const fastestReport = await Interaction.findOne({
    where: {
      campaignId: id,
      reportedAt: { [Op.not]: null },
    },
    order: [["reportedAt", "ASC"]],
    attributes: ["recipientEmail", "reportedAt"],
  });
  res.json({
    campaign: {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      audience: campaign.audience,
      template: campaign.template,
      totalSent: totalInteractions,
      totalOpened: totalInteractions,
      totalClicked: campaign.interactions?.filter((i) => i.clicked).length ?? 0,
      fastestReport: fastestReport
        ? {
            email: fastestReport.recipientEmail,
            reportedAt: fastestReport.reportedAt,
          }
        : null,
      totalReported: (campaign.interactions || []).filter((i) => i.reported)
        .length,
      interactions: (campaign.interactions || []).map((i) => ({
        recipientEmail: i.recipientEmail,
        clicked: i.clicked,
        reported: i.reported,
        submitted: i.submitted,
        name: i.name,
        timestamp: i.timestamp,
      })),
    },
  });
});

// POST: /api/campaigns/:id/send
router.post("/:id/send", authenticate, async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findOne({
    where: { id, userId: req.userId },
    include: [
      { model: Audience, include: { model: Recipient } },
      { model: Template },
    ],
  });
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });

  const recipients = campaign.audience?.recipients ?? [];
  if (!recipients.length)
    return res.status(400).json({ message: "No recipients in audience." });
  if (!campaign.template || !campaign.audience)
    return res.status(400).json({ message: "Missing template or audience." });

  for (const rec of recipients) {
    let interaction = await Interaction.findOne({
      where: { campaignId: campaign.id, recipientEmail: rec.email },
    });

    if (!interaction) {
      interaction = await Interaction.create({
        campaignId: campaign.id,
        recipientEmail: rec.email,
        name: rec.name || "",
        token: undefined,
        clicked: false,
        submitted: false,
        reported: false,
        timestamp: new Date(),
      });
    }
    const link = `${process.env.FRONTEND_URL}/landing/${campaign.id}?token=${interaction.token}`;
    const reportLink = `${process.env.FRONTEND_URL}/reportPhishing/${campaign.id}?token=${interaction.token}`;

    const html = campaign.template.content
      .replace(/\{\{link\}\}/g, link)
      .replace(/\{\{reportLink\}\}/g, reportLink);

    await sendMail({
      to: rec.email,
      subject: campaign.template.subject,
      html,
    });
  }
  campaign.status = "completed";
  await campaign.save();

  res.json({ message: "Campaign emails sent" });
});

module.exports = router;
