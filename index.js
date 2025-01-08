// index.js
import { StaticDataModel } from "./index.model.js";
import GameBoardLogic from "./logics/Gameboard.logic.js";

let currentPlayer = "player1"; // Player 1 starts the game
let gameBoard = new GameBoardLogic(
  StaticDataModel.ROWS,
  StaticDataModel.COLUMNS
);

// Function to create the board
function createBoard() {
  const board = document.getElementById("board");
  const hoverIndicator = document.getElementById("hover-indicator");

  // Use values from StaticDataModel
  const { CELL_SIZE, GAP_SIZE, ROWS, COLUMNS } = StaticDataModel;

  // Set the CSS variables dynamically
  document.documentElement.style.setProperty("--cell-size", `${CELL_SIZE}px`);
  document.documentElement.style.setProperty("--gap-size", `${GAP_SIZE}px`);

  // Set board grid
  board.style.gridTemplateColumns = `repeat(${COLUMNS}, ${CELL_SIZE}px)`;
  board.style.gridTemplateRows = `repeat(${ROWS}, ${CELL_SIZE}px)`;

  // Create columns and cells
  for (let col = 0; col < COLUMNS; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    column.dataset.column = col;

    for (let row = 0; row < ROWS; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      column.appendChild(cell);
    }

    board.appendChild(column);

    // Add hover effect for the column
    column.addEventListener("mouseover", () => {
      const leftTranslate = GAP_SIZE + col * (GAP_SIZE + CELL_SIZE);
      hoverIndicator.style.left = `${leftTranslate}px`;
      hoverIndicator.style.opacity = "1"; // Fade-in when hovered
      hoverIndicator.style.visibility = "visible"; // Make visible during hover

      // Show the correct color of the hover indicator based on the current player
      hoverIndicator.style.backgroundColor =
        currentPlayer === "player1" ? "red" : "yellow";
    });

    column.addEventListener("mouseout", () => {
      hoverIndicator.style.opacity = "0"; // Fade-out when not hovered
    });

    // Add click event for dropping a disc
    column.addEventListener("click", () => {
      // Drop the disc in the selected column
      const success = gameBoard.dropDisc(col, currentPlayer);

      console.log({ success, currentPlayer });

      if (success) {
        // Update the board UI based on the new game state
        updateBoardUI();

        // Check for a winner
        const winner = gameBoard.checkWinner();
        if (winner) {
          alert(`${winner} wins!`);
          gameBoard.resetBoard(); // Reset the game after a win
          updateBoardUI(); // Update the board UI after reset
        }

        // Switch to the next player only if there was a successful move
        currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
      }
    });
  }
}

// Update the board UI after each move
function updateBoardUI() {
  const board = document.getElementById("board");

  // Clear the current board
  board.innerHTML = "";

  // Create columns and cells
  for (let col = 0; col < StaticDataModel.COLUMNS; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    column.dataset.column = col;

    for (let row = 0; row < StaticDataModel.ROWS; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Get the current state from the game board
      const cellState = gameBoard.board[row][col].getState();

      if (cellState === "player1") {
        cell.style.backgroundColor = "red"; // Player 1 color
      } else if (cellState === "player2") {
        cell.style.backgroundColor = "yellow"; // Player 2 color
      }

      column.appendChild(cell);
    }

    board.appendChild(column);
  }

  // Update the hover indicator color based on the current player
  const hoverIndicator = document.getElementById("hover-indicator");
  hoverIndicator.style.backgroundColor =
    currentPlayer === "player1" ? "red" : "yellow";
}

// Initialize the board
createBoard();
