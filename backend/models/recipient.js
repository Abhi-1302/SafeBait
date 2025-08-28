const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Recipient extends Model {}

  Recipient.init(
    {
      email: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING },
      audienceId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "recipient" }
  );

  return Recipient;
};
