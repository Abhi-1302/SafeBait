const Sequelize = require("sequelize");
const path = require("path");

const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: path.resolve(__dirname, `../.env.${env}`) });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

const models = {
  User: require("./user")(sequelize),
  Audience: require("./audience")(sequelize),
  Recipient: require("./recipient")(sequelize),
  Template: require("./template")(sequelize),
  Campaign: require("./campaign")(sequelize),
  Interaction: require("./interaction")(sequelize),
};

// Define associations
models.User.hasMany(models.Audience, { foreignKey: "userId" });
models.Audience.belongsTo(models.User, { foreignKey: "userId" });

models.Audience.hasMany(models.Recipient, { foreignKey: "audienceId" });
models.Recipient.belongsTo(models.Audience, { foreignKey: "audienceId" });

models.Campaign.belongsTo(models.Audience, { foreignKey: "audienceId" });
models.Campaign.belongsTo(models.Template, { foreignKey: "templateId" });
models.Campaign.belongsTo(models.User, { foreignKey: "userId" });

models.Campaign.hasMany(models.Interaction, { foreignKey: "campaignId" });
models.Interaction.belongsTo(models.Campaign, { foreignKey: "campaignId" });

module.exports = { sequelize, ...models };
