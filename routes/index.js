var express = require("express");
var router = express.Router();
const text = require("../text");

const capitalize = input => input.charAt(0).toUpperCase() + input.slice(1);

const getRandomElement = (input) => input[Math.floor(Math.random() * input.length)];

const urls = [
  'https://i.imgur.com/D2EXJVi.jpg',
  'https://i.imgur.com/mn4d4KK.jpg',
  'https://i.imgur.com/P49Z9oi.jpg',
  'https://i.imgur.com/VVqENJc.jpg',
  'https://i.imgur.com/o6hmo2g.jpg',
  'https://i.imgur.com/BDAu9Ry.jpg',
  'https://i.imgur.com/Dfnz2jo.jpg',
];

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
  return [
    sents.reduce((acc, curr) => `${acc} ${curr}`),
    words[Math.ceil(Math.random() * (words.length - 1))]
  ];
};

/* GET home page. */
router.get("/", function(req, res, next) {
  const [text, word] = genRandomText();
  res.render("index", { title: capitalize(word), text, img: getRandomElement(urls) });
});

module.exports = router;
