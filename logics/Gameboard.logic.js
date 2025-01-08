// Gameboard.logic.js
import CellLogic from "./Cell.logic.js";

class GameBoardLogic {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.board = [];

    // Initialize the game board with Cell objects
    for (let row = 0; row < rows; row++) {
      const rowArray = [];
      for (let col = 0; col < columns; col++) {
        rowArray.push(new CellLogic()); // Create a new Cell object for each cell
      }
      this.board.push(rowArray);
    }
  }

  // Drop a disc in a column (player 1 or player 2)
  dropDisc(column, player) {
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row][column].getState() === "empty") {
        this.board[row][column].setState(player);
        return true; // Successfully placed the disc
      }
    }
    return false; // Column is full
  }

  // Reset the entire board
  resetBoard() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.board[row][col].reset();
      }
    }
  }

  // Get the current state of the board
  getBoardState() {
    return this.board.map((row) => row.map((cell) => cell.getState()));
  }

  // Check for a winner (horizontal, vertical, diagonal)
  checkWinner() {
    // Check rows, columns, and diagonals for a winning condition
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const currentPlayer = this.board[row][col].getState();
        if (currentPlayer === "empty") continue;

        // Horizontal Check
        if (
          col + 3 < this.columns &&
          currentPlayer === this.board[row][col + 1].getState() &&
          currentPlayer === this.board[row][col + 2].getState() &&
          currentPlayer === this.board[row][col + 3].getState()
        ) {
          return currentPlayer;
        }

        // Vertical Check
        if (
          row + 3 < this.rows &&
          currentPlayer === this.board[row + 1][col].getState() &&
          currentPlayer === this.board[row + 2][col].getState() &&
          currentPlayer === this.board[row + 3][col].getState()
        ) {
          return currentPlayer;
        }

        // Diagonal Check (bottom-left to top-right)
        if (
          row + 3 < this.rows &&
          col + 3 < this.columns &&
          currentPlayer === this.board[row + 1][col + 1].getState() &&
          currentPlayer === this.board[row + 2][col + 2].getState() &&
          currentPlayer === this.board[row + 3][col + 3].getState()
        ) {
          return currentPlayer;
        }

        // Diagonal Check (top-left to bottom-right)
        if (
          row - 3 >= 0 &&
          col + 3 < this.columns &&
          currentPlayer === this.board[row - 1][col + 1].getState() &&
          currentPlayer === this.board[row - 2][col + 2].getState() &&
          currentPlayer === this.board[row - 3][col + 3].getState()
        ) {
          return currentPlayer;
        }
      }
    }

    return null; // No winner
  }
}

export default GameBoardLogic;
