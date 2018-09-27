export default function indexLocalPeople(people, config, localIndex, peopleIndex, tribeLand) {

  let squaresDone = [];

  const findPeopleInNextSquare = (thisX, thisY, steps, cell) => {

    if (squaresDone[thisX] && squaresDone[thisX][thisY]) return;

    peopleIndex[thisX][thisY].forEach((personId) => {
      cell.push(personId);
    });

    const nextStep = steps + 1;
    if (nextStep <= config.localDistance) {
      let nextX;
      let nextY;
      nextX = thisX - 1;
      if (nextX < 0) nextX = tribeLand.getLandWidth() - 1;
      nextY = thisY;
      findPeopleInNextSquare(nextX, nextY, nextStep, cell);
      nextX = thisX + 1;
      if (nextX >= tribeLand.getLandWidth()) nextX = 0;
      nextY = thisY;
      findPeopleInNextSquare(nextX, nextY, nextStep, cell);
      nextX = thisX;
      nextY = thisY - 1;
      if (nextY < 0) nextY = tribeLand.getLandHeight() - 1;
      findPeopleInNextSquare(nextX, nextY, nextStep, cell);
      nextX = thisX;
      nextY = thisY + 1;
      if (nextY >= tribeLand.getLandHeight()) nextY = 0;
      findPeopleInNextSquare(nextX, nextY, nextStep, cell);
    }

    if (!squaresDone[thisX]) {
      squaresDone[thisX] = [];
    }
    if (!squaresDone[thisX][thisY]) {
      squaresDone[thisX][thisY] = true;
    }
    return;
  }

  localIndex.forEach((row, indexX) => {
    row.forEach((cell, indexY) => {
      cell.splice(0, cell.length);
      squaresDone = [];
      findPeopleInNextSquare(indexX, indexY, 0, cell);
    });
  });
};
