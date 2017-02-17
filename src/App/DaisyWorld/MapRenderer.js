

export default class MapRenderer {

  canvas = null;
  context = null;
  clockSpeed = null;
  itteration = 0;
  daisies = null;
  width = 0;
  height = 0;
  cellWidth = 0;
  cellHeight = 0;
  displayHover = true;
  setParentHoverContent = null;
  hoverCountX = null;
  hoverCountY = null;

  constructor(canvasId, daisies, clockSpeed, setParentHoverContent) {
    this.daisies = daisies;
    this.clockSpeed = clockSpeed;
    this.setParentHoverContent = setParentHoverContent;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = Math.floor(this.width / daisies.populationRoot);
    this.cellHeight = Math.floor(this.height / daisies.populationRoot);
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      this.render();

      this.itteration++;
      this.tickTock();
    }, this.clockSpeed);
  }

  // Public function to set the location of the mouse.
  setHover(hoverX, hoverY) {
    const countX = parseInt(hoverX / this.cellWidth, 10);
    const countY = parseInt(hoverY / this.cellHeight, 10);
    this.hoverCountX = countX;
    this.hoverCountY = countY;
    const daisy = this.daisies.daisies[countY][countX];
    this.setHoverContents(daisy);
  }

  setHoverContents(daisy) {
    const hoverContents = 'Energy: ' + daisy.energy;
    this.setParentHoverContent(hoverContents);
  }

  renderCells() {
    for (let countX = 0; countX < this.daisies.daisies.length; countX++) {
      for (let countY = 0; countY < this.daisies.daisies[countX].length; countY++) {
        // Switched count values to put the sun from top to bottom
        const daisy = this.daisies.daisies[countY][countX];
        const colour = daisy.colour;
        const red = colour;
        const green = colour;
        const blue = colour;
        this.context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

        const cellLeftTopX = countX * this.cellWidth;
        const cellLeftTopY = countY * this.cellHeight;

        this.context.fillRect(
          cellLeftTopX,
          cellLeftTopY,
          this.cellWidth - 1,
          this.cellHeight - 1
        );
      }
    }
  }

  render() {
    this.context.fillStyle = `rgb(255, 255, 255)`;
    this.context.fillRect(0, 0, this.width, this.height);
    this.renderCells();
  }
}
