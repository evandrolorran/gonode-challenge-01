const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const checkInputMiddleware = (req, res, next) => {
  if (req.query.name === '') {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/major', checkInputMiddleware, (req, res) => {
  res.render('major', { name: req.query.name });
});

app.get('/minor', checkInputMiddleware, (req, res) => {
  res.render('minor', { name: req.query.name });
});

app.post('/check', (req, res) => {
  const currentDate = moment()
    .year('year')
    .month('month')
    .date('day');

  const dateDiff = currentDate.diff(req.body.birthDate, 'years');

  if (dateDiff >= 18) {
    res.redirect(`/major/?name=${req.body.userName}`);
  } else {
    res.redirect(`/minor/?name=${req.body.userName}`);
  }
});

// When a enviornment port variable is defined.
// e.g. - export PORT=2808
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is up and listening on: ${PORT}`);
});
