// Cell.logic.js
class CellLogic {
  constructor() {
    this.state = "empty"; // State can be 'empty', 'player1', or 'player2'
  }

  // Get the current state of the cell
  getState() {
    return this.state;
  }

  // Set the state of the cell (player1 or player2)
  setState(player) {
    if (this.state === "empty") {
      this.state = player;
    }
  }

  // Reset the cell to its initial empty state
  reset() {
    this.state = "empty";
  }
}

export default CellLogic;
