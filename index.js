import { StaticDataModel } from "./index.model.js";
import GameBoardLogic from "./logics/Gameboard.logic.js";

let currentPlayer = "player1"; // Player 1 starts the game
const gameBoard = new GameBoardLogic(
  StaticDataModel.ROWS,
  StaticDataModel.COLUMNS
);

const board = document.getElementById("board");
const hoverIndicator = document.getElementById("hover-indicator");
const winnerModal = document.getElementById("winner-modal"); // Modal element
const winnerMessage = document.getElementById("winner-message"); // Winner message in modal
const restartButton = document.getElementById("restart-button"); // Restart button in modal

const { CELL_SIZE, GAP_SIZE, ROWS, COLUMNS } = StaticDataModel;

let isAnimating = false; // Track animation state

// Function to create the board
function createBoard() {
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
  }

  // Attach events to columns
  attachEvents();
}

// Function to attach events to all columns
function attachEvents() {
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const colIndex = parseInt(column.dataset.column);

    // Hover effect
    column.addEventListener("mouseover", () => {
      const leftTranslate = gameBoard.getLeftStartingPointOfCoin(
        GAP_SIZE,
        colIndex,
        CELL_SIZE
      );
      hoverIndicator.style.left = `${leftTranslate}px`;
      hoverIndicator.style.opacity = "1"; // Fade-in when hovered
      hoverIndicator.style.visibility = "visible"; // Make visible during hover

      hoverIndicator.style.backgroundColor =
        currentPlayer === "player1" ? "red" : "yellow";
    });

    column.addEventListener("mouseout", () => {
      hoverIndicator.style.opacity = "0"; // Fade-out when not hovered
    });

    // Click event for dropping a disc
    column.addEventListener("click", () => handleColumnClick(colIndex));
  });
}

// Function to detach all events
function resetEvents() {
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const newColumn = column.cloneNode(true);
    column.parentNode.replaceChild(newColumn, column);
  });
}

// Handle column click
function handleColumnClick(colIndex) {
  if (isAnimating) return; // Ignore clicks during animation

  // Find the first empty row in the column
  const rowIndex = gameBoard.getFirstEmptyRow(colIndex);
  if (rowIndex === -1) return; // If the column is full, do nothing

  isAnimating = true; // Set animation flag

  // Create a temporary disc for the animation
  const disc = document.createElement("div");
  disc.classList.add("animated-disc");
  disc.style.backgroundColor = currentPlayer === "player1" ? "red" : "yellow";
  disc.style.left = `${gameBoard.getLeftStartingPointOfCoin(
    GAP_SIZE,
    colIndex,
    CELL_SIZE
  )}px`;
  disc.style.top = "0px";

  // Add the disc to the board container
  board.appendChild(disc);

  // Animate the disc to the target row
  const targetTop = rowIndex * (CELL_SIZE + GAP_SIZE);
  setTimeout(() => {
    disc.style.top = `${targetTop}px`;
  }, 0);

  // After the animation ends, update the board state
  setTimeout(() => {
    if (board.contains(disc)) {
      board.removeChild(disc); // Remove the temporary disc if it exists
    }

    // Drop the disc in the game logic
    const success = gameBoard.dropDisc(colIndex, currentPlayer);

    if (success) {
      // Update the board UI
      updateBoardUI();

      // Check for a winner
      const winner = gameBoard.checkWinner();
      if (winner) {
        showWinner(winner);
        isAnimating = false; // Reset animation flag after showing the winner modal
        return; // Stop further execution after showing winner modal
      }

      // Switch to the next player
      currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

      // Update the hover indicator to reflect the new player
      hoverIndicator.style.backgroundColor =
        currentPlayer === "player1" ? "red" : "yellow";
    }

    isAnimating = false; // Reset animation flag
  }, 500); // Match the animation duration
}

// Show winner with confetti and modal
function showWinner(winner) {
  // Display the winner message
  winnerMessage.textContent = `${
    winner === "player1" ? "Player 1" : "Player 2"
  } wins! 🎉`;

  // Trigger confetti animation
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Display the modal
  winnerModal.style.display = "flex";
}

// Restart the game
function restartGame() {
  // Reset the game board
  gameBoard.resetBoard();
  updateBoardUI();

  // Hide the winner modal
  winnerModal.style.display = "none";

  // Reset the current player
  currentPlayer = "player1";

  // Update the hover indicator color
  hoverIndicator.style.backgroundColor = "red";
}

// Update the board UI after each move
function updateBoardUI() {
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

  // Reset and reattach events after updating the UI
  resetEvents();
  attachEvents();
}

// Initialize the board
createBoard();

// Attach event listener to the restart button
restartButton.addEventListener("click", restartGame);
