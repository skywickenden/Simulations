
import Contemplation from './Emotions/Contemplation';
import Hunger from './Emotions/Hunger';

export default class Emotion {

  world = null;
  person = null;

  hunger = null;

  name = 'Meditating';

  constructor(world, person) {
    this.world = world;
    this.person = person;

    this.constructEmotions();

    this.tickTock();
  }

  constructEmotions() {
    this.hunger = new Hunger(this.world, this.person);
    this.contemplation = new Contemplation(this.world, this.person);
  }


  tickTock() {
    setTimeout(() => {
      if (this.person.alive === false) return;

      const highest = this.findHighest();
      highest.setActivity();
      this.name = highest.name;

      this.tickTock();
    }, this.clockSpeed);
  }

  findHighest() {
    let highest = this.contemplation;
    if (this.hunger.value > highest.value) highest = this.hunger;
    return highest;
  }

}
