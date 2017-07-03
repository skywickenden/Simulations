export default class Contemplation {

  world = null;
  person = null;

  value = 5; // 0 - 100;

  name = 'Contemplation';

  constructor(world, person) {
    this.world = world;
    this.person = person;
  }

  set(value) {
    this.value = value;
  }

  setActivity() {

  }

}
