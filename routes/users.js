const Op = require("sequelize").Op;
const { Sentence, Tag } = require("../config/sequelize.js");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router
  .get("/", function(req, res, next) {
    Tag.findAll().then(tags =>
      res.render("postcard", {
        tags: tags.map(t => ({ text: t.body, id: t.id }))
      })
    );
  })
  .post("/", (req, res) => {
    const tagIds = Object.entries(req.body).reduce(
      (acc, [key, value]) => (value === "on" ? [...acc, key] : acc),
      []
    );
    Tag.findAll({
      attributes: ["body"],
      where: { id: { [Op.in]: tagIds } },
      include: {
        attributes: ["body"],
        model: Sentence
      }
    }).then(tags =>
      res.render("index", {
        text: [
          ...new Set(
            tags
              .map(t => t.sentences.map(s => s.body))
              .reduce((acc, curr) => [...acc, ...curr], [])
          )
        ].reduce((acc, curr) => `${acc} ${curr}`, "")
      })
    );
  });

module.exports = router;
