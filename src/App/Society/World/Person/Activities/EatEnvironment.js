import random from './../../../../../libraries/random';

export default class EatEnvironment {

  world = null;
  person = null;
  activity = null;
  shouldCycle = false;
  cycleCount = 0;
  maxCycleCount = 200;
  topExpereince = 2;

  allResources = [
    {
      name: 'dirt',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You eat some dirt. It's not really doing anything for you.`,
    },
    {
      name: 'bark',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You eat some bark. It's a bit chewy.`,
    },
    {
      name: 'pebbles',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You chew on some pebbles and crack a tooth.`,
    },
    {
      name: 'mud',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You slurp up some mud. It tastes a bit plain.`,
    },
    {
      name: 'foot',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You try eating your foot. Ouch. Nope, that hurts as much as your hand did.`,
    },
    {
      name: 'resin',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You chow down on some tree resin. Hmmm mmmMM mmm ARGGMM.`,
    },
    {
      name: 'poo',
      energy: 0,
      level: 1,
      expereince: 0,
      message: `You eat some poo that an animal left behind. Your breath smells.`,
    },
    {
      name: 'dead leaf',
      energy: 1,
      level: 2,
      expereince: 0,
      message: `You eat a dead leaf. It crunches to dust in your mouth and makes your throat dry.`,
    },
    {
      name: 'grass',
      energy: 1,
      level: 2,
      expereince: 0,
      message: `You eat a buch of grass. It takes a lot chewing. You don't seem to get much from it.`,
    },
    {
      name: 'tree root',
      energy: 1,
      level: 2,
      expereince: 0,
      message: `You eat a small tree root. It is very stringy and makes you retch when it tickles your tonsels.`,
    },
  ];

  activeResources = [];

  constructor(world, person, activity) {
    this.world = world;
    this.person = person;
    this.activity = activity;
    this.activateInitialResources();
  }

  activateInitialResources() {
    this.allResources.forEach((resource) => {
      if (resource.level === 1) this.activeResources.push({ ...resource });
    });
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
    if (this.activeResources.length > 0) {
      const randomIndex = Math.floor(random(this.world.seed) * this.activeResources.length);
      const resource = this.activeResources[randomIndex];
      let messageColour = 'green';
      if (resource.energy <= 0) messageColour = 'red';
      this.world.appendMessage(resource.message, messageColour);

      if (this.world.experience.forage.level > 0) {
        resource.expereince += this.world.experience.forage.level;
        if (resource.expereince > this.topExpereince) {
          this.activeResources.splice(randomIndex, 1);
        }
      }
      console.log(this.world.experience.forage.level);
    } else {
      this.world.appendMessage('The is nothing here to eat.', 'red');
    }

    this.cycleCount = 0;
    this.shouldCycle = true;
    this.tickTock();

  }

}
