const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Model {
    validPassword(password) {
      return bcrypt.compareSync(password, this.password_hash);
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { sequelize, modelName: "user" }
  );

  return User;
};
