export default class Energy {

  world = null;
  person = null;

  clockModifier = 1; // two orders of magnitude slower than the main clock.
  quantity = 550;
  depletionRate = 0.1;
  max = 1000;

  levels = {
    stuffed: 750,
    plenty: 500,
    peckish: 400,
    hungry: 300,
    mustEat: 150,
    starving: 50,
  }

  constructor(world, person) {
    this.world = world;
    this.person = person;
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      if (this.person.alive === false) return;

      this.quantity -= this.depletionRate;
      const quantity = this.quantity;
      const levels = this.levels;
      const hunger = this.person.emotion.hunger;

      if (quantity < 0) this.world.personDied(this.person.personIndex);

      if (quantity <= levels.plenty  && quantity > levels.peckish) {
        hunger.set(10);
      }

      if (quantity <= levels.peckish  && quantity > levels.hungry) {
        hunger.set(50);
      }

      if (quantity <= levels.hungry  && quantity > levels.mustEat) {
        hunger.set(70);
      }

      if (quantity <= levels.mustEat  && quantity > levels.starving) {
        hunger.set(95);
      }

      if (quantity <= levels.starving) {
        hunger.set(100);
      }


      this.tickTock();
    }, this.world.clockSpeed * this.clockModifier);
  }

}
