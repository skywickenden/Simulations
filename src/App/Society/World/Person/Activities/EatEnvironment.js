import random from './../../../../../libraries/random';

export default class EatEnvironment {

  world = null;
  person = null;
  activity = null;
  environment = null;
  shouldCycle = false;
  cycleCount = 0;
  maxCycleCount = 200;
  topExpereince = 2;
  eatQuantity = 0.03;

  activeResources = [];

  comedyResources = [
    {
      name: 'foot',
      energy: 0,
      level: 1,
      quantity: 0.04,
      expereince: 0,
      message: `You try eating your foot. Ouch. Nope, that hurts as much as your hand did.`,
    }
  ];

  constructor(world, person, activity) {
    console.log('eat constructor');
    this.world = world;
    this.person = person;
    this.activity = activity;
    this.environment = this.world.getCell(this.person.location);
    this.activateInitialResources();
  }

  activateInitialResources() {
    console.log(this.environment);
    console.log(this.environment.resources);
    this.environment.resources.forEach((resource) => {
      if (resource.level === 1) this.activeResources.push(resource);
    });

    // Comedy resource....
    this.comedyResources.forEach((resource) => {
      this.activeResources.push(resource);
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

  isResourceComedy(resource) {
    const found = this.comedyResources.find((comedyResource) => {
      return comedyResource.name === resource.name;
    });
     return found === undefined ? false : true;
  }

  eatComedyResource(resource) {
    console.log('eatComedyResource', resource.quantity);
    if (resource.quantity < this.eatQuantity) {
      return false;
    } else {
      resource.quantity -= this.eatQuantity;
      return true;
    }
  }

  engage() {
    console.log('Eating');
    this.activity.setActivityName('Eating');
    if (this.activeResources.length > 0) {
      const randomIndex = Math.floor(random(this.world.seed) * this.activeResources.length);
      const resource = this.activeResources[randomIndex];

      let eaten = false;
      if (this.isResourceComedy(resource)) {
        eaten = this.eatComedyResource(resource);
      } else {
        eaten = this.environment.useResource(resource, this.eatQuantity);
      }
      // @todo grow the current persons forage expereince for this item.
      //this.person.expereince.forage

      let messageColour = 'green';
      if (resource.energy <= 0) messageColour = 'red';
      let message = resource.message;
      if (eaten === false) {
        message = `You tried to eat some ${resource.name} but could not find any`;
        messageColour = 'red';
      }
      this.world.appendMessage(message, messageColour);

      if (this.world.playerExperience.forage.level > 0) {
        resource.expereince += this.world.playerExperience.forage.level;
        if (resource.expereince > this.topExpereince) {
          this.activeResources.splice(randomIndex, 1);
        }
      }
      console.log(this.world.playerExperience.forage.level);
    } else {
      this.world.appendMessage('The is nothing here to eat.', 'red');
    }

    this.cycleCount = 0;
    this.shouldCycle = true;
    this.tickTock();

  }

}
