export default function isFertile(person, config, dayCount) {
  if (person.sex === 'Female') {
    if (person.age > config.pubertyAge && person.age < config.menopauseAge) {
      const months = Math.floor((dayCount + person.birthday) / config.daysInMonth);
      const days = (dayCount + person.birthday) - (months * config.daysInMonth);
      if (days <= config.daysFertile) {
        person.fertile = true;
      } else {
        person.fertile = false;
      }
    } else {
      person.fertile = false;
    }
  } else {
    if (person.age > config.pubertyAge) {
      person.fertile = true;
    } else {
      person.fertile = false;
    }
  }
}
