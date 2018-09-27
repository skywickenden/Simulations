
import createPerson from './createPerson';

// Spawns a person randomy if the population is below the spawn level.
export default function spawn(personCount, config, activities, health, tribeLand,
  peopleIndex, dayCount, people
) {
  while (people.length < config.spawnMinimum) {
    const person = createPerson(
      personCount,
      config,
      activities,
      health,
      tribeLand,
      peopleIndex,
      dayCount
    );
    people.push(person);
  }
}
