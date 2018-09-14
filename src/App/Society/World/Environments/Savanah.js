export default class Savanah {

  world = null;

  name = 'Savanah';

  // All quantities are in cubic liters.
  resources = [
    {
      name: 'dirt',
      energy: 0,
      level: 1,
      quantity: 1228800, // (64 meters * 64 meters * 0.3 meters) * 1000
      expereince: 0,
      message: `You eat some dirt. It's not really doing anything for you.`,
    },
    {
      name: 'dead bark',
      energy: 0,
      level: 1,
      quantity: 250, // (5 trees * 0.01 meter thickness * 5 meter length * 1 meter width) * 1000
      expereince: 0,
      message: `You eat some bark. It's a bit chewy.`,
    },
    {
      name: 'pebbles',
      energy: 0,
      level: 1,
      quantity: 80, // (20 meters * 20 meters * 0.002 meters) * 1000
      expereince: 0,
      message: `You chew on some pebbles and crack a tooth.`,
    },
    {
      name: 'mud',  // next to river
      energy: 0,
      level: 1,
      quantity: 1000, // (100 meters * 0.5 meters * 0.002 meters) * 1000
      expereince: 0,
      message: `You slurp up some mud. It tastes a bit plain.`,
    },
    {
      name: 'resin',
      energy: 0,
      level: 1,
      quantity: 0.2, // (10 trees * 0.5 meters * 0.02 meters * 0.002 meters) * 1000
      expereince: 0,
      message: `You chow down on some tree resin. Hmmm mmmMM mmm ARGGMM.`,
    },
    {
      name: 'poo',
      energy: 0,
      level: 1,
      quantity: 1,
      expereince: 0,
      message: `You eat some poo that an animal left behind. Your breath smells.`,
    },
    {
      name: 'dead leaf',
      energy: 1,
      level: 2,
      quantity: 1,
      expereince: 0,
      message: `You eat a dead leaf. It crunches to dust in your mouth and makes your throat dry.`,
    },
    {
      name: 'grass',
      energy: 1,
      level: 2,
      quantity: 10800,
      expereince: 0,
      message: `You eat a buch of grass. It takes a lot chewing. You don't seem to get much from it.`,
    },
    {
      name: 'tree root',
      energy: 1,
      level: 2,
      quantity: 100,
      expereince: 0,
      message: `You eat a small tree root. It is very stringy and makes you retch when it tickles your tonsels.`,
    },
  ];

  constructor(world) {
    this.world = world;
  }

  useResource(resource, quantity) {
    const localResource = this.resources.find((row) => {
      return row.name === resource.name;
    })
    if (localResource === undefined) {
      console.error('localResource not found', resource.name);
      return false;
    } else {
      if (localResource.quantity < quantity) {
        return false;
      } else {
        localResource.quantity -= quantity;
        return true;
      }
    }
  }

}
