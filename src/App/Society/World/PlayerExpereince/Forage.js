export default class Forage {

  world = null;

  name = 'Forage';
  level = 0;

  // When ever a resource is used/harvested expereince is gained.
  resourceExperience = [];

  constructor(world) {
    this.world = world;
  }

  levelUp() {
    this.level++;
  }

  gainExpereince(resource, experienceGained) {
    const localResource = this.resourceExperience.forEach((row) => {
      return row.name === resource.name;
    });
    if (localResource === undefined) {
      this.resourceExperience.push({name: resource.name, experience: experienceGained});
    } else {
      localResource.experience += experienceGained;
    }
  }

}
