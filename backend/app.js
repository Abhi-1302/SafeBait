const path = require("path");

const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: path.resolve(__dirname, `.env.${env}`) });
const cors = require("cors");
const express = require("express");
const { sequelize } = require("./models");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const audienceRoutes = require("./routes/audience");
const templateRoutes = require("./routes/template");
const campaignRoutes = require("./routes/campaign");
const landingRoutes = require("./routes/landing");
const reportPhishingRoutes = require("./routes/reportPhishing");
const recipientRoutes = require("./routes/recipient");
const adminRoutes = require("./routes/admin");

const app = express();

const allowedOrigins = [
  "https://safe-bait.vercel.app",
  // "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/audiences", audienceRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/landing", landingRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/reportPhishing", reportPhishingRoutes);
app.use("/api/admin", adminRoutes);

// Ping route
app.get("/", (req, res) => {
  res.json({ message: "SafeBait Backend is running." });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});

// For vercel deployment
module.exports = app;
