import socialiseWithPerson from './socialiseWithPerson';

export default function socialise(person, index, config, people) {
  if (
    person.energy > config.minEnergyToSocialise
    && person.mate === null
    && person.age >= config.pubertyAge
  ) {
    for (let i = index + 1; i < people.length - 1; i++) {
      if (people[i].energy <= config.minEnergyToSocialise
        || people[i].mate !== null
        || people[i].age < config.pubertyAge
      )  {
        break;
      }
      socialiseWithPerson(person, people[i], config);
    }
    for (let i = 0; i < index; i++) {
      if (people[i].energy <= config.minEnergyToSocialise
        || people[i].mate !== null
        || people[i].age < config.pubertyAge
      )  {
        break;
      }
      socialiseWithPerson(person, people[i], config);
    }
  }
}
