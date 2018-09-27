export default function loopPosition(person, tribeLand) {
  if (person.position.y < 0) {
    person.position.y += tribeLand.getLandHeight() - 1;
  }
  if (person.position.y >= tribeLand.getLandHeight()) {
    person.position.y -= tribeLand.getLandHeight() - 1;
  }
  if (person.position.x < 0) {
    person.position.x += tribeLand.getLandWidth() - 1;
  }
  if (person.position.x >= tribeLand.getLandWidth()) {
    person.position.x -= tribeLand.getLandWidth() - 1;
  }
}
