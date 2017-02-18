import Person from './Person';

export default class World {

  name = 'boo';
  people = [];
  clockSpeed = null;

  constructor(clockSpeed) {
    this.clockSpeed = clockSpeed;
    this.people.push(new Person(this, this.people.length));
  }

  personDied(personIndex) {
    console.log('personDied', personIndex);
    this.people[personIndex].setDead();
    this.people[personIndex] = undefined;
  }

}
