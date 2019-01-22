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
    console.log(req.body);
    res.send("lol");
  });

module.exports = router;
