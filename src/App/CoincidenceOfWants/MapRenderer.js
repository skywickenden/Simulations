

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
      // person.tradedWith.forEach((partner) => {
      //   tradingWith += partner.name + ' ';
      // });
      let resources = '';
      Object.keys(person.resources).forEach((resourceName) => {
        const resource = person.resources[resourceName];
        resources += ` | ${resourceName} ${resource}`;
      });
      this.hoverContents = person.name + ' ' + tradingWith + ' | money ' + person.money + resources;
      this.setParentHoverContent(this.hoverContents);
    }
  }

  renderCells() {
    for (let countX = 0; countX < this.Population.populationRoot; countX++) {
      for (let countY = 0; countY < this.Population.populationRoot; countY++) {
        const personId = this.calculatePersonId(countX, countY);
        const person = this.Population.people[personId];
        if (countX === this.hoverCountX && countY === this.hoverCountY) {
          this.setHoverContents(person);
        }
        let red = person.resources['food'] < 255 ? person.resources['food'] : 255;
        let green = person.resources['clothing'] < 255 ? person.resources['clothing'] : 255;
        let blue = person.resources['shelter'] < 255 ? person.resources['shelter'] : 255;
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
      }
    }
  }

  drawConnection(person, partner) {
    const cellLeftTopX = person.countX * this.cellWidth;
    const cellLeftTopY = person.countY * this.cellHeight;
    const halfWidth = this.cellWidth / 2;
    const halfHeight = this.cellHeight / 2;
    // All these edge cases are for when the line goes off the map
    if (person.countX === 0 && partner.countX === this.Population.populationRoot - 1) {
      this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
      this.context.lineTo(
        0,
        person.countY * this.cellHeight + halfHeight + 2
      );
      this.context.moveTo(
        partner.countX * this.cellWidth + halfWidth - 2,
        partner.countY * this.cellHeight + halfHeight - 2
      );
      this.context.lineTo(
        partner.countX * this.cellWidth + halfWidth + halfWidth,
        partner.countY * this.cellHeight + halfHeight + 2
      );
      return;

    } else if (person.countX === this.Population.populationRoot - 1 && partner.countX === 0) {
      this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
      this.context.lineTo(
        person.countX * this.cellWidth + halfWidth + halfWidth + 2,
        person.countY * this.cellHeight + halfHeight + 2
      );
      this.context.moveTo(
        partner.countX * this.cellWidth + halfWidth - 2,
        partner.countY * this.cellHeight + halfHeight - 2
      );
      this.context.lineTo(
        0,
        partner.countY * this.cellHeight + halfHeight + 2
      );
      return;

    } else if (person.countY === 0 && partner.countY === this.Population.populationRoot - 1) {
      this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
      this.context.lineTo(
        person.countX * this.cellWidth + halfWidth + 2,
        0
      );
      this.context.moveTo(
        partner.countX * this.cellWidth + halfWidth - 2,
        partner.countY * this.cellHeight + halfHeight - 2
      );
      this.context.lineTo(
        partner.countX * this.cellWidth + halfWidth + 2,
        partner.countY * this.cellHeight + halfHeight + halfHeight + 2
      );
      return;

    } else if (person.countY === this.Population.populationRoot - 1 && partner.countY === 0) {
      this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
      this.context.lineTo(
        person.countX * this.cellWidth + halfWidth + 2,
        person.countY * this.cellHeight + halfHeight + halfHeight + 2,
      );
      this.context.moveTo(
        partner.countX * this.cellWidth + halfWidth - 2,
        partner.countY * this.cellHeight + halfHeight - 2
      );
      this.context.lineTo(
        partner.countX * this.cellWidth + halfWidth + 2,
        0
      );
      return;

    } else {
      this.context.moveTo(cellLeftTopX + halfWidth - 2, cellLeftTopY + halfHeight - 2);
      this.context.lineTo(
        partner.countX * this.cellWidth + halfWidth + 2,
        partner.countY * this.cellHeight + halfHeight + 2
      );
    }
  }

  renderConnections() {
    for (let countX = 0; countX < this.Population.populationRoot; countX++) {
      for (let countY = 0; countY < this.Population.populationRoot; countY++) {
        const personId = this.calculatePersonId(countX, countY);
        const person = this.Population.people[personId];

        this.context.beginPath();
        this.context.strokeStyle = `rgb(150, 0, 0)`;
        person.soldTo.forEach(this.drawConnection.bind(this, person));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.strokeStyle = `rgb(0, 150, 0)`;
        person.boughtFrom.forEach(this.drawConnection.bind(this, person));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.strokeStyle = `rgb(0, 0, 150)`;
        person.sharedWith.forEach((partner) => { this.drawConnection(person, partner); });
        this.context.stroke();
        this.context.closePath();
      }
    }
  }

  render() {
    this.context.fillStyle = `rgb(255, 255, 255)`;
    this.context.fillRect(0, 0, this.width, this.height);
    this.renderCells();
    this.renderConnections();
  }
}
