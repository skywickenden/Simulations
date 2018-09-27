import random from './../../../libraries/random';

import removePositionIndex from './removePositionIndex';
import loopPosition from './loopPosition';
import insertPositionIndex from './insertPositionIndex';

export default function isItTimeToWalkabout(person, config, peopleIndex, tribeLand) {
  if (person.enoughFoodForaged === false
    && person.walkStepQuantity === 0
    && person.age > config.pubertyAge
  ) {
    const rand = random();
    const walkDirectionRND = Math.floor(rand * 4);
    switch(walkDirectionRND) {
      case 0:
        person.walkDirection = 'North';
        break;
      case 1:
        person.walkDirection = 'West';
        break;
      case 2:
        person.walkDirection = 'South';
        break;
      case 3:
      case 4:
        person.walkDirection = 'East';
        break;
      default:
        console.error('walkDirectionRND error', walkDirectionRND, rand);
    }
    person.walkSpeed = config.normalWalkSpeed;
    person.walkStepQuantity = 1 / config.normalWalkSpeed; // one world unit.
    person.children.forEach((child) => {
      if (child.mother && person && child.mother.id === person.id) {
        child.walkDirection = person.walkDirection;
        child.walkSpeed = person.walkSpeed;
        child.walkStepQuantity = person.walkStepQuantity; // one world unit.
      }
    });
  }

  if (person.walkDirection
    && person.walkSpeed > 0
    && person.walkStepQuantity > 0
    && person.age > config.pubertyAge
  ) {
    person.walkStepQuantity -= 1;
    let xWalkSpeed = 0;
    let yWalkSpeed = 0;
    switch(person.walkDirection) {
      case 'North':
        yWalkSpeed -= person.walkSpeed;
        break;
      case 'West':
        xWalkSpeed -= person.walkSpeed;
        break;
      case 'South':
        yWalkSpeed += person.walkSpeed;
        break;
      case 'East':
        xWalkSpeed += person.walkSpeed;
        break;
      default:
    }
    removePositionIndex(person, peopleIndex);
    person.position.x += xWalkSpeed;
    person.position.y += yWalkSpeed;
    person.children.forEach((child) => {
      if (child.mother && person && child.mother.id === person.id) {
        child.position.x += xWalkSpeed;
        child.position.y += yWalkSpeed;
        loopPosition(child, tribeLand);
      }
    });

    loopPosition(person, tribeLand);
    insertPositionIndex(person, peopleIndex);
  }
}
