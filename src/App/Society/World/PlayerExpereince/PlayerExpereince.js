import Forage from './Forage';

export default class PlayerExpereince {

  world = null;

  forage = null;

  constructor(world) {
    this.world = world;
    this.forage = new Forage();
  }

}
