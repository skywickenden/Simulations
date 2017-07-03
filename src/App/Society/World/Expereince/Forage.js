export default class Forage {

  world = null;

  name = 'Forage';
  level = 0;

  constructor(world) {
    this.world = world;
  }

  levelUp() {
    this.level++;
  }

}
