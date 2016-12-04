

export default class MapRenderer {

  canvas = null;
  context = null;
  clockSpeed = null;
  itteration = 0;
  Population = null;
  width = 0;
  height = 0;
  cellWidth = 0;
  cellHeight = 0;
  displayHover = true;
  hoverContents = '';
  setParentHoverContent = null;
  hoverCountX = null;
  hoverCountY = null;

  constructor(canvasId, Population, clockSpeed, setParentHoverContent) {
    this.Population = Population;
    this.clockSpeed = clockSpeed;
    this.setParentHoverContent = setParentHoverContent;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = Math.floor(this.width / Population.populationRoot);
    this.cellHeight = Math.floor(this.height / Population.populationRoot);
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      this.render();

      this.itteration++;
      this.tickTock();
    }, this.clockSpeed);
  }

  setHover(hoverX, hoverY) {
    const countX = parseInt(hoverX / this.cellWidth, 10);
    const countY = parseInt(hoverY / this.cellHeight, 10);
    this.hoverCountX = countX;
    this.hoverCountY = countY;
    const personId = this.calculatePersonId(countX, countY);
    const person = this.Population.people[personId];
    this.setHoverContents(person);
  }

  calculatePersonId(countX, countY) {
    return countY + (countX * this.Population.populationRoot);
  }

  setHoverContents(person) {
    if (person) {
      let tradingWith = '';
      person.tradedWith.forEach((partner) => {
        tradingWith += partner.name;
      });
      let resources = '';
      Object.keys(person.resources).forEach((resourceName) => {
          const resource = person.resources[resourceName];
          resources += ` | ${resourceName} ${resource.quantity}`;
      });
      this.hoverContents = tradingWith + ' | money ' + person.money + resources;
      this.setParentHoverContent(this.hoverContents);
    }
  }

  render() {
    this.context.beginPath();
    this.context.fillStyle = `rgb(255, 255, 255)`;
    this.context.fillRect(0, 0, this.width, this.height);
    for (let countX = 0; countX < this.Population.populationRoot; countX++) {
      for (let countY = 0; countY < this.Population.populationRoot; countY++) {
        const personId = this.calculatePersonId(countX, countY);
        const person = this.Population.people[personId];
        if (countX === this.hoverCountX && countY === this.hoverCountY) {
          this.setHoverContents(person);
        }
        let red = person.resources['food'].quantity < 255 ? person.resources['food'].quantity : 255;
        let green = person.resources['clothing'].quantity < 255 ? person.resources['clothing'].quantity : 255;
        let blue = person.resources['shelter'].quantity < 255 ? person.resources['shelter'].quantity : 255;
        if (person.alive === false) {
          red = 0;
          green = 0;
          blue = 0;
        }
        this.context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

        const cellLeftTopX = countX * this.cellWidth;
        const cellLeftTopY = countY * this.cellHeight;

        this.context.fillRect(
          cellLeftTopX,
          cellLeftTopY,
          this.cellWidth - 1,
          this.cellHeight - 1
        );

        const halfWidth = this.cellWidth / 2;
        const halfHeight = this.cellHeight / 2;

        person.tradedWith.forEach((partner) => {
          this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
          this.context.lineTo(
            partner.countX * this.cellWidth + halfWidth + 2,
            partner.countY * this.cellHeight + halfHeight + 2
          );
        });
      }
    }
    this.context.stroke();
  }
}
