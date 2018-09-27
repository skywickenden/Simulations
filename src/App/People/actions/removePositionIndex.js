export default function removePositionIndex(person, peopleIndex) {
  if (Math.floor(person.position.x) >= 0 && Math.floor(person.position.x) < 20) {
    if (Math.floor(person.position.y) >= 0 && Math.floor(person.position.y) < 20) {
      const indexReference = peopleIndex[Math.floor(person.position.x)][Math.floor(person.position.y)];
      if (indexReference.indexOf(person.id) > -1) {
        indexReference.splice(indexReference.indexOf(person.id), 1);
      }
    }
  }
}
