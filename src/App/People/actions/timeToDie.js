import removePositionIndex from './removePositionIndex';

export default function timeToDie(person, personIndex, people, peopleIndex) {
  if (person.mate) {
    person.mate.mate = null;
  }
  if (person.children) {
    person.children.forEach((child) => {
      if (person.sex === 'Male') child.father = null;
      if (person.sex === 'Female') child.mother = null;
    });
  }
  if (person.mother) {
    person.mother.children.forEach((child, index) => {
      if (person.id === child.id) person.mother.children.splice(index, 1);
    });
  }
  if (person.father) {
    person.father.children.forEach((child, index) => {
      if (person.id === child.id) person.father.children.splice(index, 1);
    });
  }
  removePositionIndex(person, peopleIndex);
  people.splice(personIndex, 1);
}
