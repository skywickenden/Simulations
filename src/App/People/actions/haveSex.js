import random from './../../../libraries/random';

import isFertile from './isFertile';

export default function haveSex(person, config, dayCount) {
  isFertile(person, config, dayCount);

  if (person.mate) {
    if (person.energy > config.minEnergyToHaveSex
      && person.mate.energy > config.minEnergyToHaveSex
    ) {
      person.energy -= config.energyToHaveSex;
      person.mate.energy -= config.energyToHaveSex;
      const lowestFertilityRate = person.fertilityRate > person.mate.fertilityRate
        ? person.mate.fertilityRate : person.fertilityRate;
      const conception = lowestFertilityRate > random();
      if (conception) {
        if (person.mate.sex === 'Male' && person.sex === 'Female' && person.pregnant === false) {
          person.pregnant = config.pregnancyTime;
        }
        if (person.sex === 'Male' && person.mate.sex === 'Female' && person.mate.pregnant === false) {
          person.mate.pregnant = config.pregnancyTime;
        }
      }
    }
  }
}
