import Player from './Player.js'
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor() {
    this.WIDTH = 7;
    this.HEIGHT = 6;

    this.players = null;
    this.board = null; // array of rows, each row is array of cells  (board[y][x])
    this.status = "paused";

    this.makeHtmlForm();
    this.makeHtmlButton();
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlButton() {
    const gameDiv = document.getElementById('game');
    const btn = document.createElement('button');
    btn.id = 'button';
    btn.textContent = 'Start';
    btn.addEventListener('click', this.handleClick.bind(this));
    gameDiv.prepend(btn);
  }

  updateHtmlButton(text) {
    const btn = document.getElementById('button');
    btn.textContent = text;
  }

  makeHtmlForm() {
    const gameDiv = document.getElementById('game');

    const label1 = document.createElement('label');
    label1.setAttribute('for', 'player-1-color')
    label1.textContent = 'Player 1'
    const input1 = document.createElement('input');
    input1.id = 'player-1-color';
    input1.setAttribute('type', 'color');

    const label2 = document.createElement('label');
    label2.setAttribute('for', 'player-2-color');
    label2.textContent = 'Player 2'
    const input2 = document.createElement('input');
    input2.id = 'player-2-color';
    input2.setAttribute('type', 'color');

    gameDiv.prepend(input2);
    gameDiv.prepend(label2);
    gameDiv.prepend(input1);
    gameDiv.prepend(label1);
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.status = 'gameover';
    this.updateHtmlButton('Restart');
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if(this.status === 'playing' && evt.target.id !== 'button') {

      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.players[0].id;
      this.players[0].placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.players[0].id} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      [this.players[1], this.players[0]] = [this.players[0], this.players[1]]
    } else {
      if(evt.target.id === 'button' && this.status !== 'playing') {
        this.makeBoard();
        this.makeHtmlBoard();
        this.players = [
          new Player(1, document.getElementById('player-1-color').value),
          new Player(2, document.getElementById('player-2-color').value),
        ]
        this.status = 'playing';
        return;
      }  
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.players[0].id
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}


new Game();