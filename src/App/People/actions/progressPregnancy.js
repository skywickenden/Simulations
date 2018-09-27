import giveBirth from './giveBirth';

export default function progressPregnancy(person, config, personCount, activities,
  health, tribeLand, peopleIndex, dayCount, people
) {
  if (person.pregnant) {
    person.pregnant -= 1;
    if (person.pregnant < 1) {
      giveBirth(
        person,
        config,
        personCount,
        activities,
        health,
        tribeLand,
        peopleIndex,
        dayCount,
        people
      );
    }
  }
}
