import timeToDie from './timeToDie';

export default function isBirthday(person, index, config, dayCount, people, peopleIndex) {
  if (dayCount === person.birthday) {
    person.age += 1;
    if (person.age >= config.ageAtDeath) {
      timeToDie(person, index, people, peopleIndex);
    }
  }
}
