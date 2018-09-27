export default function socialiseWithPerson(person, person2, config) {
  if (person2.energy > config.minEnergyToSocialise) {
    if (!person.relationships[person2.id]) {

      const distance1 = Math.abs(person.personalityType - person2.personalityType);
      let distance2 = 1, distance3 = 1;
      if (person.personalityType < 0.5 && person2.personalityType > 0.5) {
        distance2 = Math.abs((person.personalityType + 1) - person2.personalityType);
      }
      if (person2.personalityType < 0.5 && person.personalityType > 0.5) {
        distance3 = Math.abs((person2.personalityType + 1) - person.personalityType);
      }
      // negative relationships are dislikes.
      const relationshipDistance = Math.min(distance1, distance2, distance3) - 0.25;
      const relationship = {
        friend: 0,
        potentialMate: 0,
        relationshipDistance,
      };
       person.relationships[person2.id] = relationship;
       person2.relationships[person.id] = relationship;
    }

    const relationship = person.relationships[person2.id];

    if (person.age > config.pubertyAge && person2.age > config.pubertyAge) {
      if ((person.sex === 'Female' && person2.sex === 'Male')
        || (person2.sex === 'Female' && person.sex === 'Male')
      ) {
        // relationship.potentialMate += Math.floor(relationship.relationshipDistance * 10);
        relationship.potentialMate += relationship.relationshipDistance * 10;
      }
    }
    relationship.friend += Math.floor(relationship.relationshipDistance * 10);


    if (person.mate === null && person2.mate === null
      && relationship.potentialMate > config.potentialMateBecomesMate
    ) {
      person.mate = person2;
      person2.mate = person;
    }
  }
}
