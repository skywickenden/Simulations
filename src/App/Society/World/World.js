import Person from './Person/Person';

import Savanah from './Environments/Savanah';

export default class World {

  people = [];
  clockSpeed = null;

  tmpEnvironment = null;

  constructor(clockSpeed, initialPersonEnergy) {
    this.clockSpeed = clockSpeed;
    this.people.push(new Person(this, this.people.length, initialPersonEnergy));
    this.tmpEnvironment = new Savanah(this);
  }

  personDied(personIndex) {
    console.log('personDied', personIndex);
    this.people[personIndex].setDead();
    this.people[personIndex] = undefined;
  }

  // Stub until we have a world!
  getCell(location) {
    return(this.tmpEnvironment);
  }

}
