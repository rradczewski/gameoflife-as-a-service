const fetch = require('node-fetch');

const TARGET_URL = process.argv[2];
const WIDTH = new Number(process.argv[3]);

const iterate = (board) => {
  let newBoard = [];
  for(let y = 0; y < board.length; y++) {
    newBoard[y] = [];
    for(let x = 0; x < board[y].length; x++) {
      newBoard[y][x] = willCellBeAliveInNextIteration(board, x, y);
    }
  }
  return newBoard;
};

const willCellBeAliveInNextIteration = (board, x, y) => {
  const numLivingNeighbours = numberOfLivingNeighbours(board, x, y);
  const isCellAlive = board[y][x];

  if(isCellAlive) {
    return numLivingNeighbours == 2 || numLivingNeighbours == 3;
  } else {
    return numLivingNeighbours == 3;
  }
};

const numberOfLivingNeighbours = (board, x, y) => {
  let num = 0;
  if(y > 0 && x > 0 && board[y-1][x-1]) num++;
  if(y > 0 && board[y-1][x]) num++;
  if(y > 0 && x < board.length-1 && board[y-1][x+1]) num++;

  if(x > 0 && board[y][x-1]) num++;
  if(x < board.length-1 && board[y][x+1]) num++;

  if(y < board.length-1 && x > 0 && board[y+1][x-1]) num++;
  if(y < board.length-1 && board[y+1][x]) num++;
  if(y < board.length-1 && x < board.length-1 && board[y+1][x+1]) num++;

  return num;
};

const sendBoard = (targetUrl, board) => fetch(targetUrl, {
  headers: { 'Content-Type': 'application/json'},
  method: 'POST',
  body: JSON.stringify(board)
});

const randomBoard = (width) => {
  const board = [];
  for(var i = 0; i < width; i++) {
    board[i] = [];
    for (var j = 0; j < width; j++) {
      board[i].push(Math.random() > 0.5 ? 1 : 0);
    }
  }
  return board;
};

const mainLoop = (board) => () => {
  const newBoard = iterate(board);
  console.log('Sending new board to', TARGET_URL);
  sendBoard(TARGET_URL, newBoard)
    .then(() => setTimeout(mainLoop(newBoard)), 200)
    .catch(e => console.error(e));
};

mainLoop(randomBoard(WIDTH))();
