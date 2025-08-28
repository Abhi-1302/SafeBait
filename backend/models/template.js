const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Template extends Model {}

  Template.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING },
      subject: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    { sequelize, modelName: "template" }
  );

  return Template;
};
