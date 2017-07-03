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
  initialEnergy = 0;
  location = {
    x: 1,
    y: 1,
  };

  alive = true;

  constructor(world, personIndex, initialEnergy) {
    this.world = world;
    this.personIndex = personIndex;
    this.initialEnergy = initialEnergy;
    this.environment = world.getCell(location).environemnt;
    this.needs = new Need(world, this, initialEnergy);
    this.emotion = new Emotion(world, this);
    this.activity = new Activity(world, this);
  }

  setDead() {
    this.alive = false;
  }

  rebirth() {
    this.alive = true;
    this.needs = new Need(this.world, this, this.initialEnergy);
    this.emotion = new Emotion(this.world, this);
    this.activity = new Activity(this.world, this);
    this.world.appendMessage('With a flash of light you find yourself back where you were, only somthing is subtly different.');
  }

}
