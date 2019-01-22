const Sequelize = require("sequelize");
const SentenceModel = require("../models/Sentence.js");
const TagModel = require("../models/Tag.js");
const sequelize = new Sequelize("db", "", "", {
  host: "localhost",
  dialect: "sqlite",
  operatorsAliases: "false",
  storage: "./db/db.sqlite",
  retry: {
    max: 10
  },
  pool: {
    max: 1,
    min: 1
  }
});

const Sentence = SentenceModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
Tag.belongsToMany(sequelize.models.sentence, { through: "SentenceTag" });
Sentence.belongsToMany(sequelize.models.tag, { through: "SentenceTag" });

sequelize.sync({ force: true });

module.exports = {
  sequelize,
  Sequelize,
  Sentence,
  Tag
};
