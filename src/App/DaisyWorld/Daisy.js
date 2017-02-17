import gaussian from './../../libraries/gaussian';

export default class Daisy {

  colour = 0;
  colourMean = 127;
  colourDeviation = 25;
  colourGuassian = null;
  colourExtraMean = 50;
  colourExtraDeviation = 10;
  colourExtraGuassian = null;

  initialEnergy = 100;
  energyUsedPerTurn = 10;
  energyPerSunlight = 100;
  overheatEnergy = 1000;
  sunlight = 0;
  energy = 0;
  clockSpeed = 0;
  itteration = 0;
  deathAge = 0;
  getNeighbours= null;

  constructor(clockSpeed, sunlight, getNeighbours) {
    this.clockSpeed = clockSpeed;
    this.sunlight = sunlight;
    this.getNeighbours = getNeighbours;
    this.colourGuassian = gaussian(this.colourMean, this.colourDeviation);
    this.colourExtraGuassian = gaussian(this.colourExtraMean, this.colourExtraDeviation);
    this.initialise();
    this.tickTock();
  }

  initialise() {
    this.colour = parseInt(this.colourGuassian(), 10);
    if (this.colour <= 0) this.colour = 1;  // prevent division by 0
    if (this.colour > 255) this.colour = 255;
    this.energy = this.initialEnergy;
  }

  tickTock() {
    setTimeout(() => {
      this.growOlder();

      // this.colour = this.colour - 1;
      // if (this.temperature === 0) this.temperature = 0;

      this.itteration++;
      this.tickTock();
    }, this.clockSpeed);
  }

  growOlder() {
    this.energy = this.energy - this.energyUsedPerTurn;

    let newEnergy = this.sunlight * this.energyPerSunlight;
    // dark colours get more energy.
    newEnergy *= ((255 - this.colour) / 255);
    this.energy += newEnergy;

    if (this.energy >= this.overheatEnergy) this.reBirth();

    if (this.energy <= 0) this.reBirth();
  }

  reBirth() {
    const neighbours = this.getNeighbours();
    this.colour = neighbours[0].colour
      + neighbours[1].colour
      + neighbours[2].colour
      + neighbours[3].colour;
    this.colour = parseInt(this.colour / 4, 10);
    // add a bit of random variation.
    this.colour += parseInt(this.colourExtraGuassian(), 10) - this.colourExtraMean;

    if (this.colour <= 0) this.colour = 1;  // prevent division by 0
    if (this.colour > 255) this.colour = 255;
    this.energy = this.initialEnergy;
  }
}
