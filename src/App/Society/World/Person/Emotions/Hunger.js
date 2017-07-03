export default class Hunger {

  world = null;
  person = null;

  value = 0; // 0 - 100;

  name = 'Hunger';

  constructor(world, person) {
    this.world = world;
    this.person = person;
  }

  set(value) {
    this.value = value;
  }

  setActivity() {
    console.log('hunger active');
  }

}
