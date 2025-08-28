const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Audience extends Model {}

  Audience.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "audience" }
  );

  return Audience;
};
