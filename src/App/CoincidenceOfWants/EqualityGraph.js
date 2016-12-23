

export default class EqualityGraph {

  canvas = null;
  context = null;
  clockSpeed = null;
  itteration = 0;
  width = 0;
  height = 0;
  population = null;
  moneyIndex = []; // population indexed by money value.

  constructor(canvasId, clockSpeed, population) {
    this.clockSpeed = clockSpeed;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.population = population;
    this.main();
  }

  tickTock() {
    setTimeout(() => {
      this.main();
    }, this.clockSpeed);
  }

  main() {
    this.indexPopulationByMoney();
    this.draw();
    this.itteration++;
    this.tickTock();
  }

  indexPopulationByMoney() {

  }

  drawLines() {
    this.context.beginPath();
    this.context.strokeStyle = `rgb(150, 150, 150)`;
    this.population.people.forEach((person, index) => {
      const left = Math.floor(index / this.population.people.length * this.width);
      this.context.moveTo(left, this.height);
      const top = this.height - Math.floor(person.money / this.population.maxWealth * this.height);
      this.context.lineTo(left, top);
    });
    this.context.stroke();
    this.context.closePath();
  }

  draw() {
    this.context.fillStyle = `rgb(255, 555, 255)`;
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawLines();
  }
}
