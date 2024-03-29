// global cell width
const cellWidth = 20
const cellHeight = 20

// set canvas to full size
const _canvas = document.getElementById("canvas")
_canvas.width = window.innerWidth
_canvas.height = window.innerHeight

class Cell {
  static width = cellWidth;
  static height = cellHeight;

  constructor (context, gridX, gridY) {
    this.context = context;

    // Store the position of this cell in the grid
    this.gridX = gridX;
    this.gridY = gridY;

    // Make random cells alive
    this.alive = Math.random() > 0.75;
  }

  draw() {
    // Draw a simple square
    this.context.fillStyle = this.alive ? '#F6F7F9' : 'white';
    this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
  }
}

class GameWorld {

  constructor(canvasId, innerWidth, innerHeight) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.gameObjects = [];


    this.numColumns = Math.round(innerWidth / cellWidth)
    this.numRows = Math.round(innerHeight / cellHeight)

    this.createGrid();

    // Request an animation frame for the first time
    // The gameLoop() function will be called as a callback of this request
    window.requestAnimationFrame(() => this.gameLoop());
  }

  createGrid() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        this.gameObjects.push(new Cell(this.context, x, y));
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= this.numColumns || y < 0 || y >= this.numRows){
      return false;
    }

    return this.gameObjects[this.gridToIndex(x, y)].alive?1:0;
  }

  gridToIndex(x, y) {
    return x + (y * this.numColumns);
  }

  checkSurrounding() {
    // Loop over all cells
    for (let x = 0; x < this.numColumns; x++) {
      for (let y = 0; y < this.numRows; y++) {

        // Count the nearby population
        let numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);
        let centerIndex = this.gridToIndex(x, y);

        if (numAlive == 2) {
          // Do nothing
          this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
        } else if (numAlive == 3) {
          // Make alive
          this.gameObjects[centerIndex].nextAlive = true;
        } else {
          // Make dead
          this.gameObjects[centerIndex].nextAlive = false;
        }
      }
    }

    // Apply the new state to the cells
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
    }
  }

  gameLoop() {
    // Check the surrounding of each cell
    this.checkSurrounding();

    // Clear the screen
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all the gameobjects
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw();
    }

    // The loop function has reached it's end, keep requesting new frames
    setTimeout( () => {
      window.requestAnimationFrame(() => this.gameLoop());
    }, 100)
  }
}

window.onload = () => {
  // The page has loaded, start the game
  new GameWorld('canvas', window.innerWidth, window.innerHeight);
}

// source: https://spicyyoghurt.com/tutorials/javascript/conways-game-of-life-canvas
