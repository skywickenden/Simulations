import Needs from './Needs';
import Emotion from './Emotion';
import Activity from './Activity';

export default class Person {

  world = null;
  personIndex = null;
  needs = null;
  emotion = null;
  activity = null;

  alive = true;

  constructor(world, personIndex) {
    this.world = world;
    this.personIndex = personIndex;
    console.log(personIndex);
    this.needs = new Needs(world, this);
    this.emotion = new Emotion(world, this);
    this.activity = new Activity(world, this);
  }

  setDead() {
    this.alive = false;
  }

}
