var express = require("express");
var router = express.Router();
const text = require("../text");

const capitalize = input => input.charAt(0).toUpperCase() + input.slice(1);

const genRandomText = (n = 7) => {
  let story = "";
  let sents = [];
  let numbers = [];
  for (let i = 0; i <= n; i++) {
    let r = Math.floor(Math.random() * text.length);
    if (numbers.includes(r)) {
      i--;
    } else {
      numbers.push(r);
      sents.push(text[r][0]);
    }
  }

  let ra = Math.floor(Math.random() * text.length);
  let words = text[ra][0].split(" ");
  console.log(words);
  return [
    sents.reduce((acc, curr) => `${acc} ${curr}`),
    words[Math.ceil(Math.random() * (words.length - 1))]
  ];
};

/* GET home page. */
router.get("/", function(req, res, next) {
  const [text, word] = genRandomText();
  res.render("index", { title: capitalize(word), text });
});

module.exports = router;
