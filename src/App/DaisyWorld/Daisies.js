import Daisy from './Daisy';

export default class Daisies {

  daisies = [];
  clockSpeed = 0;
  populationRoot = 0;

  constructor(populationRoot, clockSpeed) {
    this.populationRoot = populationRoot;
    this.clockSpeed = clockSpeed;
    const degreesPerLayer = 180 / populationRoot;
    for (let x = 0; x < populationRoot; x++) {
      this.daisies[x] = [];

      // calculate degrees of sunlight
      let angle = x * degreesPerLayer;
      const angleInRadians = this.degreesToRadians(angle);
      const sunlight = Math.sin(angleInRadians);

      for (let y = 0; y < populationRoot; y++) {
        this.daisies[x][y] = new Daisy(
          clockSpeed,
          sunlight,
          this.getNeighbours.bind(this, x, y)
        );
      }
    }
  }

  getNeighbours(x, y) {
    const neighbours = [];
    const left = (x !== 0) ? x - 1 : this.populationRoot - 1;
    const right = (x !== this.populationRoot - 1) ? x + 1 : 0;
    const above = (y !== 0) ? y - 1 : this.populationRoot - 1;
    const bellow = (y !== this.populationRoot - 1) ? y + 1 : 0;
    neighbours.push(this.daisies[left][y]);
    neighbours.push(this.daisies[right][y]);
    neighbours.push(this.daisies[x][above]);
    neighbours.push(this.daisies[x][bellow]);
    return neighbours;
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}
