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

let isAnimating = false; // Track animation state

const {
  CELL_SIZE,
  GAP_SIZE,
  CELL_SIZE_MOBILE,
  GAP_SIZE_MOBILE,
  ROWS,
  COLUMNS,
  ANIMATION_DURATION,
} = StaticDataModel;

// Global configuration object for sizes
let sizeConfig = {
  cellSize: CELL_SIZE,
  gapSize: GAP_SIZE,
};

// Function to update global size configuration based on screen width
function updateSizeConfig() {
  const isMobile = window.innerWidth <= 600;
  sizeConfig.cellSize = isMobile ? CELL_SIZE_MOBILE : CELL_SIZE;
  sizeConfig.gapSize = isMobile ? GAP_SIZE_MOBILE : GAP_SIZE;

  // Update CSS variables
  document.documentElement.style.setProperty(
    "--cell-size",
    `${sizeConfig.cellSize}px`
  );
  document.documentElement.style.setProperty(
    "--gap-size",
    `${sizeConfig.gapSize}px`
  );
  document.documentElement.style.setProperty(
    "--animation-duration",
    `${ANIMATION_DURATION}ms`
  );
  document.documentElement.style.setProperty("--row-count", ROWS);
  document.documentElement.style.setProperty("--col-count", COLUMNS);
}

// Function to create the board
function createBoard() {
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

  attachEvents();
}

// Function to attach events to all columns
function attachEvents() {
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const colIndex = parseInt(column.dataset.column);

    column.addEventListener("mouseover", () => {
      const leftTranslate = gameBoard.getLeftStartingPointOfCoin(
        sizeConfig.gapSize,
        colIndex,
        sizeConfig.cellSize
      );
      hoverIndicator.style.left = `${leftTranslate}px`;
      hoverIndicator.style.opacity = "1";
      hoverIndicator.style.visibility = "visible";

      hoverIndicator.style.backgroundColor =
        currentPlayer === "player1" ? "red" : "yellow";
    });

    column.addEventListener("mouseout", () => {
      hoverIndicator.style.opacity = "0";
    });

    column.addEventListener("click", () => handleColumnClick(colIndex));
  });
}

// Handle column click
function handleColumnClick(colIndex) {
  if (isAnimating) return;

  const rowIndex = gameBoard.getFirstEmptyRow(colIndex);
  if (rowIndex === -1) return;

  isAnimating = true;

  const disc = document.createElement("div");
  disc.classList.add("animated-disc");
  disc.style.backgroundColor = currentPlayer === "player1" ? "red" : "yellow";
  disc.style.left = `${gameBoard.getLeftStartingPointOfCoin(
    sizeConfig.gapSize,
    colIndex,
    sizeConfig.cellSize
  )}px`;
  disc.style.top = "0px";

  board.appendChild(disc);

  const targetTop = rowIndex * (sizeConfig.cellSize + sizeConfig.gapSize);
  setTimeout(() => {
    disc.style.top = `${targetTop}px`;
  }, 0);

  setTimeout(() => {
    if (board.contains(disc)) {
      board.removeChild(disc);
    }

    const success = gameBoard.dropDisc(colIndex, currentPlayer);

    if (success) {
      updateBoardUI();

      const winner = gameBoard.checkWinner();
      if (winner) {
        showWinner(winner);
        isAnimating = false;
        return;
      }

      currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
      hoverIndicator.style.backgroundColor =
        currentPlayer === "player1" ? "red" : "yellow";
    }

    isAnimating = false;
  }, ANIMATION_DURATION);
}

// Show winner with confetti and modal
function showWinner(winner) {
  winnerMessage.textContent = `${
    winner === "player1" ? "Player 1" : "Player 2"
  } wins! 🎉`;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });

  winnerModal.style.display = "flex";
}

// Restart the game
function restartGame() {
  gameBoard.resetBoard();
  updateBoardUI();
  winnerModal.style.display = "none";
  currentPlayer = "player1";
  hoverIndicator.style.backgroundColor = "red";
}

// Update the board UI after each move
function updateBoardUI() {
  board.innerHTML = "";

  for (let col = 0; col < StaticDataModel.COLUMNS; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    column.dataset.column = col;

    for (let row = 0; row < StaticDataModel.ROWS; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const cellState = gameBoard.board[row][col].getState();

      if (cellState === "player1") {
        cell.style.backgroundColor = "red";
      } else if (cellState === "player2") {
        cell.style.backgroundColor = "yellow";
      }

      column.appendChild(cell);
    }

    board.appendChild(column);
  }

  resetEvents();
  attachEvents();
}

// Function to reset and reattach events
function resetEvents() {
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const newColumn = column.cloneNode(true);
    column.parentNode.replaceChild(newColumn, column);
  });
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
  updateSizeConfig();
  createBoard();
});

// Update size config on window resize
window.addEventListener("resize", updateSizeConfig);

// Attach event listener to the restart button
restartButton.addEventListener("click", restartGame);
