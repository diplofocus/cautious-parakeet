const { Sentence } = require("./Sentence");

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("tag", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  });
  return Tag;
};
