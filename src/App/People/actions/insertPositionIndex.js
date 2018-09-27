export default function insertPositionIndex(person, peopleIndex) {
  if (Math.floor(person.position.x) >= 0 && Math.floor(person.position.x) < 20) {
    if (Math.floor(person.position.y) >= 0 && Math.floor(person.position.y) < 20) {
      const indexReference = peopleIndex[Math.floor(person.position.x)][Math.floor(person.position.y)];
      indexReference.push(person.id);
    }
  }
}
