import consumeFood from './consumeFood';

export default function isItTimeToForage(person, config, tribeLand) {
  if (person.age > config.pubertyAge
    && person.energy > config.energyToForage
    && person.food < config.maxFoodCarried
  ) {
    let foodForaged = Math.floor(config.maxFoodToForagePerPerson * person.traits.forageSkill);
    const landX = Math.floor(person.position.x);
    const landY = Math.floor(person.position.y);
    if (foodForaged > tribeLand.getCellFood(landX, landY)) {
      foodForaged = tribeLand.getCellFood(landX, landY);
      person.enoughFoodForaged = false;
    } else {
      person.enoughFoodForaged = true;
    }
    tribeLand.removeFoodFromCell(landX, landY, foodForaged);
    person.food += foodForaged;
    person.energy -= config.energyToForage;
  }

  if (person.age <= config.pubertyAge && person.food < config.maxFoodCarried) {
    let parentWithMost;
    if (person.mother) parentWithMost = person.mother;
    if (person.father) {
      if (person.mother) {
        if (person.mother && person.father.food > person.mother.food) {
          parentWithMost = person.father;
        }
      } else {
        parentWithMost = person.father;
      }
    }
    if (parentWithMost && parentWithMost.food > config.minParentFood) {
      parentWithMost.food -= 1;
      person.food += 1;
    }
  }

  consumeFood(person, config);
}
