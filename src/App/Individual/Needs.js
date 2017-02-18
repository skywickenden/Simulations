
import Energy from './Needs/Energy';

export default class Needs {

  world = null;
  person = null;

  energy = null;

  constructor(world, person) {
    this.world = world;
    this.person = person;
    this.constructNeeds();
    // this.tickTock();
  }

  constructNeeds() {
    this.energy = new Energy(this.world, this.person);
  }

  // tickTock() {
  //   setTimeout(() => {
  //
  //     this.tickTock();
  //   }, this.clockSpeed);
  // }

}
