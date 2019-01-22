const router = require("express").Router();
const waterfall = require("async/waterfall");
const { Sentence, Tag } = require("../config/sequelize.js");
const Op = require("sequelize").Op;

router
  .route("/new-sentence")
  .get((req, res) => {
    Sentence.findAll({
      include: [
        {
          model: Tag
        }
      ]
    }).then(sentences => {
      res.render("new-sentence", {
        sentences: sentences.map(s => ({
          sentence: s.body,
          tags: s.tags.map(t => {
            return t.body;
          })
        }))
      });
    });
  })
  .post((req, res) => {
    const tagsText = req.body.tags.split(";");
    Tag.findAll({
      where: {
        [Op.or]: tagsText.map(t => ({
          body: t
        }))
      }
    }).then(existingTags => {
      const remainingTags = tagsText.filter(
        t => !existingTags.some(et => et.body === t)
      );
      return Promise.all(
        remainingTags.map(rt =>
          Tag.create({
            body: rt
          })
        )
      )
        .then(newTags =>
          Sentence.create(
            {
              body: req.body.sentence
            },
            {
              include: [Tag]
            }
          ).then(sentence => sentence.setTags([...newTags, ...existingTags]))
        )

        .then(() => res.redirect("/new-sentence"));
    });
  });

module.exports = router;
