import Need from './Need';
import Emotion from './Emotion';
import Activity from './Activity';

export default class Person {

  world = null;
  personIndex = null;
  need = null;
  emotion = null;
  activity = null;
  environment = null;
  location = {
    x: 1,
    y: 1,
  };

  alive = true;

  constructor(world, personIndex, initialEnergy) {
    this.world = world;
    this.personIndex = personIndex;
    this.environment = world.getCell(location).environemnt;
    this.needs = new Need(world, this, initialEnergy);
    this.emotion = new Emotion(world, this);
    this.activity = new Activity(world, this);
  }

  setDead() {
    this.alive = false;
  }

}
