import Person from './Person/Person';
import PlayerExpereince from './PlayerExpereince/PlayerExpereince';

import Savanah from './Environments/Savanah';

export default class World {

  playerExperience = null
  people = [];
  clockSpeed = null;
  messageLog = [];
  seed = 1; // Used for predictable random number generation.

  tmpEnvironment = null;

  constructor(clockSpeed, initialPersonEnergy, initialPeopleQuantity) {
    this.clockSpeed = clockSpeed;
    this.tmpEnvironment = new Savanah(this);
    this.playerExperience = new PlayerExpereince();
    for (let i = 0; i < initialPeopleQuantity; i++) {
      console.log('people ', i);
      this.people.push(new Person(this, this.people.length, initialPersonEnergy));
    }
  }

  personDied(personIndex) {
    console.log('personDied', personIndex);
    this.people[personIndex].setDead();
    this.people[personIndex] = undefined;
  }

  appendMessage(message, colour = 'black') {
    this.messageLog.push({text: message, colour: colour});
    if (this.messageLog.length > 10) this.messageLog.splice(0, 1);
  }

  // Stub until we have a world!
  // Note. Each location is aprox one acer (64x64m) (this is 36.48 billion cells in the worlsd)
  getCell(location) {
    console.log(this.tmpEnvironment);
    return(this.tmpEnvironment);
  }

}
