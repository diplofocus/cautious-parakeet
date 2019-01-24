const Op = require("sequelize").Op;
const { Sentence, Tag } = require("../config/sequelize.js");
var express = require("express");
var router = express.Router();

const urls = [
  "https://i.imgur.com/D2EXJVi.jpg",
  "https://i.imgur.com/mn4d4KK.jpg",
  "https://i.imgur.com/P49Z9oi.jpg",
  "https://i.imgur.com/VVqENJc.jpg",
  "https://i.imgur.com/o6hmo2g.jpg",
  "https://i.imgur.com/BDAu9Ry.jpg",
  "https://i.imgur.com/Dfnz2jo.jpg"
];

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
        image: urls[Math.floor(Math.random() * urls.length)],
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
