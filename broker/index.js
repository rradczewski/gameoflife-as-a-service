const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');

const boards = {};

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(cors());

app.get('/board/:id', (req, res) => {
  if(!boards[req.id]) {
    return res.sendStatus(404);
  }
  res.send(boards[req.id]);
});

app.post('/board/:id', json(), (req, res) => {
  boards[req.id] = req.body;
  res.sendStatus(200);
});

app.listen(app.get('port'));
