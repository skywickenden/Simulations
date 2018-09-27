export default function consumeFood(person, config) {
  while (person.energy <= config.baseHunger * person.traits.feelsHunger && person.food > 0) {
    person.food -= 1;
    person.energy += config.energyFromFood;
  }

  if (person.energy <= 0) {
    person.health -= 0.1;
  }
}
