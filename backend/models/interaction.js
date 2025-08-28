const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Interaction extends Model {}

  Interaction.init(
    {
      campaignId: { type: DataTypes.INTEGER, allowNull: false },
      recipientEmail: { type: DataTypes.STRING, allowNull: false },
      clicked: { type: DataTypes.BOOLEAN, defaultValue: false },
      name: { type: DataTypes.STRING },
      token: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      reported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      reportedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: "interaction" }
  );

  return Interaction;
};
