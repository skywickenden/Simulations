import gaussian from './../../../libraries/gaussian';
import random from './../../../libraries/random';

import isFertile from './isFertile';

export default function createPerson(personCount, config, activities, health,
  tribeLand, peopleIndex, dayCount
) {
  // const startingGuassian = gaussian(0.5, 0.125, 0.01, 0.99);
  const ageGuassian = gaussian(30, 5, 15, 50);
  // const fertilityGuassian = gaussian(0.2, 0.04, 0, 1);
  const person = {
    name: 'person ' + personCount.count,
    id: personCount.count,
    food: 10,
    enoughFoodForaged: true,
    energy: 100,
    age: Math.floor(ageGuassian()),
    birthday: Math.floor(random() * config.daysInYear),
    activity: activities[0],
    health: health.healthy,
    sex: random() > 0.5 ? 'Male' : 'Female',
    fertilityRate: 0.15, // fertilityGuassian(),
    personalityType: random(), // closer numbers are more compaitible - rolls over from 1 to 0.
    pregnant: false,
    mate: null,
    relationships: {}, // indexed by person id , contians object {friend:int, potentialMate:int}
    father: null,
    mother: null,
    children: [],
    position: {
      x: random() * tribeLand.getLandWidth(), // In world units, not pixels
      y: random() * tribeLand.getLandHeight(), // In world units, not pixels
    },
    walkDirection: null, // North, East, South, West
    walkSpeed: 0, // In world units
    walkStepQuantity: 0,
    traits: {
      feelsHunger: 0.5,// startingGuassian(),
      forageSkill: 0.5, // startingGuassian(),
    },
  };
  peopleIndex[Math.floor(person.position.x)][Math.floor(person.position.y)].push(person.id);
  personCount.count += 1;
  isFertile(person, config, dayCount);
  return person;
};
