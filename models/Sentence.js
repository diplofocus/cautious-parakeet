const { Tag } = require("./Tag");

module.exports = (sequelize, DataTypes) => {
  const Sentence = sequelize.define("sentence", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  return Sentence;
};
