export default class EatEnvironment {

  world = null;
  person = null;
  activity = null;
  shouldCycle = false;
  cycleCount = 0;
  maxCycleCount = 100;

  constructor(world, person, activity) {
    this.world = world;
    this.person = person;
    this.activity = activity;
  }

  tickTock() {
    setTimeout(() => {
      if (this.person.alive === false) return;

      if (this.cycleCount > this.maxCycleCount) {
        this.shouldCycle = false;
        this.activity.setDefaultActivity();
      }

      this.cycleCount += 1;
      if (this.shouldCycle) this.tickTock();
    }, this.clockSpeed);
  }

  engage() {
    console.log('Eating');
    this.activity.setActivityName('Eating');
    this.cycleCount = 0;
    this.shouldCycle = true;
    this.tickTock();
  }

}
