import random from './random';

export default function shuffle(arrayToSuffle) {
  let currentIndex = arrayToSuffle.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arrayToSuffle[currentIndex];
    arrayToSuffle[currentIndex] = arrayToSuffle[randomIndex];
    arrayToSuffle[randomIndex] = temporaryValue;
  }

  return arrayToSuffle;
}
