import shuffle from './../../../libraries/shuffle';

export default function fight(people, localIndex, tribeLand, config) {

  const looseEnergy = ((energyToLoose, people) => {
    people.forEach((person) => {
      person.energy -= energyToLoose;
    });
  });

  for (let y = 0; y < tribeLand.getLandHeight(); y++) {
    for (let x = 0; x < tribeLand.getLandWidth(); x++) {
      if (tribeLand.getCellFood(x, y) <= config.foodShortage && localIndex.length > 1) {
        let fightingPeople = {};
        people.forEach((person) => {
          if (localIndex[x][y][person.id]) {
            fightingPeople[person.id] = person;
          }
        });
        if (Object.keys(fightingPeople).length > 1) {
          const fightIngKeys = Object.keys(fightingPeople);
          const shuffledKeys = shuffle(fightIngKeys);

          let tribe1;
          let tribe2;

          Object.keys(shuffledKeys).forEach((personIndex) => {
            const person = fightingPeople[shuffledKeys[personIndex]];

            if (!tribe1) {
              tribe1 = {
                people: [person],
                personalityType: person.personalityType,
              };
              let tribe2PersonalityType = person.personalityType + 0.5;
              if (tribe2PersonalityType > 1) tribe2PersonalityType = tribe2PersonalityType - 1;
              tribe2 = {
                people: [],
                personalityType: tribe2PersonalityType,
              }
              return;
            }

            let distanceToTribe1 = Math.abs(person.personalityType - tribe1.personalityType);
            if (distanceToTribe1 > 0.5) distanceToTribe1 = 1 - distanceToTribe1;
            let distanceToTribe2 = Math.abs(person.personalityType - tribe2.personalityType);
            if (distanceToTribe2 > 0.5) distanceToTribe2 = 1 - distanceToTribe2;
            if (distanceToTribe1 <= distanceToTribe2) {
              tribe1.people.push(person);
            } else {
              tribe2.people.push(person);
            }
          });

          if (tribe1.people.length > tribe2.people.length) {
            looseEnergy(config.energyLostWhenLosingFighting, tribe2.people);
            tribeLand.setTerritory(x, y, tribe1.personalityType);
          } else if (tribe2.people.length > tribe1.people.length) {
            looseEnergy(config.energyLostWhenLosingFighting, tribe1.people);
            tribeLand.setTerritory(x, y, tribe2.personalityType);
          } else {
            looseEnergy(Math.floor(config.energyLostWhenLosingFighting / 2), tribe1.people);
            looseEnergy(Math.floor(config.energyLostWhenLosingFighting / 2), tribe2.people);
          }
        }
      }
    }
  }
}
