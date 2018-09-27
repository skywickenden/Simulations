import timeToDie from './timeToDie';

export default function isItTimeToDie(person, personIndex, people, peopleIndex, personCount) {
  if (person.health < -1) {
    timeToDie(person, personIndex, people, peopleIndex, personCount);
  }
}
