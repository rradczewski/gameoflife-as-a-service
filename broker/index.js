const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');

const boards = {};

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(cors());

app.get('/board/:id', (req, res) => {
  if(!boards[req.params.id]) {
    console.error('No such board', req.params.id);
    return res.sendStatus(404);
  }
  res.send(boards[req.params.id]);
});

app.post('/board/:id', json({limit: '50mb'}), (req, res) => {
  boards[req.params.id] = req.body;
  console.log('New Board for', req.params.id);
  res.sendStatus(200);
});

app.listen(app.get('port'), () => {
  console.log('Broker is running on Port', app.get('port'));
});
