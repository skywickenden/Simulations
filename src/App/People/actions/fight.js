export default function fight(people, localIndex, tribeLand, config) {

  for (let y = 0; y < tribeLand.getLandHeight(); y++) {
    for (let x = 0; x < tribeLand.getLandWidth(); x++) {
      if (tribeLand.getCellFood(x, y) <= config.foodShortage && localIndex.length > 1) {

        let fightingPeople = {};
        people.forEach((person) => {
          if (localIndex[x][y][person.id]) {
            fightingPeople[person.id] = person;
          }
        });

        let tribe1;
        let tribe2;

        Object.keys(fightingPeople).forEach((person1Index) => {
          const person1 = fightingPeople[person1Index];

          if (!tribe1) {
            tribe1 = {
              people: [person1],
              personalityType: person1.personalityType,
            };
            return;
          }

          let distance = Math.abs(person1.personalityType - tribe1.personalityType);
          if (distance > 0.5) distance = 1 - distance;
          if (distance <= 0.25) {
            tribe1.people.push(person1);
            let realDistance = tribe1.personalityType - person1.personalityType;
            if (realDistance < 0) {
              tribe1.personalityType = 1 + realDistance;
            } else {
              tribe1.personalityType -= realDistance;
            }
            console.log('person', person1.id, realDistance);
          } else {

            if (!tribe2) {
              tribe2 = {
                people: [person1],
                personalityType: person1.personalityType,
              };
            } else {
              distance = Math.abs(person1.personalityType - tribe2.personalityType);
              if (distance > 0.5) distance = 1 - distance;
              tribe2.people.push(person1);
              let realDistance = tribe2.personalityType - person1.personalityType;
              if (realDistance < 0) {
                tribe2.personalityType = 1 + realDistance;
              } else {
                tribe2.personalityType -= realDistance;
              }
            }
          }

        });
        console.log('x,y', x, y, tribe1, tribe2);
      }
    }
  }
}
