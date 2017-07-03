
import EatEnvironment from './Activities/EatEnvironment';

export default class Activity {

  world = null;
  person = null;

  name = '';
  defaultActivity = 'Contemplating';

  activities = {};

  constructor(world, person) {
    this.world = world;
    this.person = person;
    this.name = this.defaultActivity;
    this.activities = {
      eatEnvironment: new EatEnvironment(this.world, this.person, this),
    };
  }

  setActivityName(name) {
    this.name = name;
  }

  setDefaultActivity() {
    this.name = this.defaultActivity;
  }

  engageActivity(name) {
    this.activities[name].engage();
  }

}
