import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

export default class Resources {

  // This multipled by the number of resource types
  // is the total resources harvested per turn.
  averageQuantityPerTurn = 5;

  types = [
    {
      name: 'food',
      distribution: {
        mean: 60,
        standardDeviation: 10,
      },
    }, {
      name: 'shelter',
      distribution: {
        mean: 60,
        standardDeviation: 10,
      },
    }, {
      name: 'clothing',
      distribution: {
        mean: 60,
        standardDeviation: 10,
      },
    }
  ];

  // constructor() {
  //
  // }

  getTypeQuantity() {
    return this.types.length;
  }

  generatePersonsResources(){
    const newResources = {};
    // New resources are deployed on a dimminishing returns basis.
    const totalResources = this.types.length * this.averageQuantityPerTurn;
    let remainingPerTurn = totalResources;
    this.types.forEach((resource, index) => {
      const newResource = {};
      newResource.name = resource.name;
      const normalPopulation = gaussian(resource.distribution.mean, resource.distribution.standardDeviation);
      newResource.quantity = parseInt(normalPopulation(), 10);
      if (index !== this.types.length - 1) {
        newResource.perTurn = Math.ceil(random() * remainingPerTurn / 2);
        remainingPerTurn -= newResource.perTurn;
      } else {
        newResource.perTurn = remainingPerTurn;
      }
      newResources[resource.name] = newResource;
    });
    return newResources;
  }
}
