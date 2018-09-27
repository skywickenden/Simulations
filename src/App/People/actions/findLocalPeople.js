export default function findLocalPeople(person, distance, peopleIndex, tribeLand) {
  const localPeople = [];
  const squaresDone = [];

  const findPeopleInNextSquare = (thisX, thisY, steps) => {

    if (squaresDone[thisX] && squaresDone[thisX][thisY]) return;

    if (peopleIndex[thisX] === undefined || peopleIndex[thisX][thisY] === undefined) {
      console.log(person.id, thisX, thisY, person.position.y);
      console.log(peopleIndex[thisX]);
    }
    peopleIndex[thisX][thisY].forEach((personId) => {
      localPeople.push(personId);
    });

    if (steps + 1 <= distance) {
      let nextX;
      let nextY;
      nextX = thisX - 1;
      if (nextX < 0) nextX = tribeLand.getLandWidth() - 1;
      nextY = thisY;
      findPeopleInNextSquare(nextX, nextY, steps + 1);
      nextX = thisX + 1;
      if (nextX >= tribeLand.getLandWidth()) nextX = 0
      nextY = thisY;
      findPeopleInNextSquare(nextX, nextY, steps + 1);
      nextX = thisX;
      nextY = thisY - 1;
      if (nextY < 0) nextY = tribeLand.getLandHeight() - 1;
      findPeopleInNextSquare(nextX, nextY, steps + 1);
      nextX = thisX;
      nextY = thisY + 1;
      if (nextY >= tribeLand.getLandHeight()) nextY = 0;
      findPeopleInNextSquare(nextX, nextY, steps + 1);
    }

    if (!squaresDone[thisX]) {
      squaresDone[thisX] = [];
    }
    if (!squaresDone[thisX][thisY]) {
      squaresDone[thisX][thisY] = true;
    }
    return;
  }
  findPeopleInNextSquare(Math.floor(person.position.x), Math.floor(person.position.y), 1);
}
