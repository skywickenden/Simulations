
import Energy from './Needs/Energy';

export default class Needs {

  world = null;
  person = null;

  energy = null;

  constructor(world, person, initialEnergy) {
    this.world = world;
    this.person = person;
    this.constructNeeds(initialEnergy);
    // this.tickTock();
  }

  constructNeeds(initialEnergy) {
    console.log('Need', initialEnergy);
    this.energy = new Energy(this.world, this.person, initialEnergy);
  }

  // tickTock() {
  //   setTimeout(() => {
  //
  //     this.tickTock();
  //   }, this.clockSpeed);
  // }

}
