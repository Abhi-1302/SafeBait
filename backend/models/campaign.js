const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Campaign extends Model {}

  Campaign.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      audienceId: { type: DataTypes.INTEGER, allowNull: false },
      templateId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: "draft" },
      sentDate: { type: DataTypes.DATE },
    },
    { sequelize, modelName: "campaign" }
  );

  return Campaign;
};
