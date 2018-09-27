import random from './../../../libraries/random';

import findNewPointFromAngle from './helpers/findNewPointFromAngle';
import createPerson from './createPerson';
import loopPosition from './loopPosition';

export default function giveBirth(person, config, personCount, activities, health,
  tribeLand, peopleIndex, dayCount, people
) {
  person.pregnant = false;
  person.energy -= config.energyToBirth;
  const newPerson = createPerson(
    personCount,
    config,
    activities,
    health,
    tribeLand,
    peopleIndex,
    dayCount
  );

  const randomAngle = Math.floor(random() * 360);
  const distanceFromMother = (tribeLand.getPersonRadius() * 2) + Math.floor(random() * 5);
  const newPoint = findNewPointFromAngle(
    person.position.x * tribeLand.getLandWidthUnitPixels(),
    person.position.y * tribeLand.getLandHeightUnitPixels(),
    randomAngle,
    distanceFromMother
  );
  newPerson.position.x = newPoint.x / tribeLand.getLandWidthUnitPixels();
  newPerson.position.y = newPoint.y / tribeLand.getLandHeightUnitPixels();
  loopPosition(newPerson, tribeLand);

  newPerson.age = 0;
  newPerson.fertile = false;
  people.push(newPerson);

  person.children.push(newPerson);
  newPerson.mother = person;
  if (person.mate) person.mate.children.push(newPerson);
  newPerson.father = person.mate;
}
