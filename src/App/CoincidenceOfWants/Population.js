// import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

import Resources from './Resources';

export default class Population {

  populationCount = 0;
  populationRoot = 0;
  clockSpeed = null;
  people = [];
  peakResources = {};
  resourcesPerTurn = 15;
  consumptionPerTurn = 2;
  shareAmount = 2;
  highStock = 100;
  lowStock = 20;
  itteration = 0;
  resources = null;

  constructor(populationRoot, clockSpeed) {
    this.resources = new Resources();
    this.populationRoot = populationRoot;
    this.populationCount = populationRoot * populationRoot;
    this.clockSpeed = clockSpeed;
    this.populate();
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      this.harvest();
      // this.trade('share');
      this.trade('buy');
      this.trade('sell');
      this.consume();

      this.itteration++;
      this.tickTock();
    }, this.clockSpeed);
  }

  trade(tradeType) {
    const tradeList = [];
    this.people.forEach((person) => {
      if (person.alive === false) return;
      person.tradedWith = [];
      this.calculateResourceStatus(person);
      tradeList.push(person)
    });
    let counter = 0;
    while(tradeList.length > 0 && counter < 1000) {
      counter++;
      const tradeListIndex = parseInt(Math.floor(random() * tradeList.length), 10);
      const personArray = tradeList.splice(tradeListIndex, 1);
      this.tradeWithPartners(personArray[0], tradeType);
    }
  }

  tradeWithPartners(person, tradeType) {
    if (person.alive === false) {
      return;
    }

    let topIndex = person.index - 1;
    const populationRoot = this.populationRoot;
    const populationCount = this.populationCount;
    //  Loop round the map if at the edge.
    if (person.countY === 0) topIndex = person.index + populationRoot - 1;
    let partnerTop = this.people[topIndex];

    let bottomIndex = person.index + 1;
    //  Loop round the map if at the edge.
    if (person.countY === populationRoot - 1) bottomIndex = person.index - populationRoot + 1;
    let partnerBottom = this.people[bottomIndex];

    let leftIndex = person.index - populationRoot;
    //  Loop round the map if at the edge.
    if (person.countX === 0) leftIndex = populationCount - (populationRoot - person.index);
    let partnerLeft = this.people[leftIndex];

    let rightIndex = person.index + populationRoot;
    //  Loop round the map if at the edge.
    if (person.countX === populationRoot - 1) rightIndex = person.countY;
    let partnerRight = this.people[rightIndex];

    // mix up the partners to randomise trading direction priorities.
    let tmpPartner;
    if (random() < 0.5) {
      tmpPartner = partnerTop;
      partnerTop = partnerBottom;
      partnerBottom = tmpPartner;
    }
    if (random() < 0.5) {
      tmpPartner = partnerRight;
      partnerRight = partnerLeft;
      partnerLeft = tmpPartner;
    }
    if (random() < 0.5) {
      tmpPartner = partnerTop;
      partnerTop = partnerLeft;
      partnerLeft = tmpPartner;
    }
    if (random() < 0.5) {
      tmpPartner = partnerRight;
      partnerRight = partnerBottom;
      partnerBottom = tmpPartner;
    }

    if (tradeType === 'share') {
      this.shareWithPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight);
    } else if (tradeType === 'buy') {
      this.buyFromPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight);
    } else if (tradeType === 'sell') {
      this.sellToPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight);
    }
  }

  sellToPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    Object.keys(person.resources).forEach((resourceName) => {
      this.sellResource(person, partnerTop, resourceName);
      this.sellResource(person, partnerBottom, resourceName);
      this.sellResource(person, partnerLeft, resourceName);
      this.sellResource(person, partnerRight, resourceName);
    });
  }

  sellResource(person, partner, resourceName) {
    if(partner.alive ===false) return;

    const resource = person.resources[resourceName];
    const partnerResource = partner.resources[resourceName];

    if (resource.quantity >= this.highStock) {
      if (partnerResource.quantity < this.highStock) {
        if (partner.money >= this.highStock) {
          resource.quantity = resource.quantity - this.shareAmount;
          partnerResource.quantity = partnerResource.quantity - this.shareAmount;
          person.money += this.shareAmount;
          partner.money -= this.shareAmount;
          person.tradedWith.push(partner);
        }
      }
    }
  }

  buyFromPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {

    Object.keys(person.resources).forEach((resourceName) => {
      this.buyResource(person, partnerTop, resourceName);
      this.buyResource(person, partnerBottom, resourceName);
      this.buyResource(person, partnerLeft, resourceName);
      this.buyResource(person, partnerRight, resourceName);
    });
  }

  buyResource(person, partner, resourceName) {
    if(partner.alive ===false) return;

    const resource = person.resources[resourceName];
    const partnerResource = partner.resources[resourceName];

    if (resource.quantity <= this.highStock) {
      if (partnerResource.quantity >= this.lowStock) {
        if (person.money >= this.lowStock) {
          resource.quantity += this.shareAmount;
          partnerResource.quantity -= this.shareAmount;
          person.money -= this.shareAmount;
          partner.money += this.shareAmount;
          person.tradedWith.push(partner);
        }
      }
    }
  }

  shareWithPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    Object.keys(person.resources).forEach((resourceName1) => {
      Object.keys(person.resources).forEach((resourceName2) => {
        if (resourceName1 !== resourceName2) {
          this.shareResource(person, partnerTop, resourceName1, resourceName2);
          this.shareResource(person, partnerBottom, resourceName1, resourceName2);
          this.shareResource(person, partnerLeft, resourceName1, resourceName2);
          this.shareResource(person, partnerRight, resourceName1, resourceName2);
        }
      });
    });
  }

  shareResource(person, partner, resourceName1, resourceName2) {
    if(partner.alive ===false) return;

    const resource1 = person.resources[resourceName1];
    const resource2 = person.resources[resourceName2];
    const partnerResource1 = partner.resources[resourceName1];
    const partnerResource2 = partner.resources[resourceName2];

    if (resource1.quantity <= this.lowStock) {
      if (partnerResource1.quantity >= this.highStock) {
        if (resource2.quantity >= this.highStock) {
          if (partnerResource2.quantity <= this.lowStock) {
            resource1.quantity= resource1.quantity + this.shareAmount;
            partnerResource1.quantity = partnerResource1.quantity - this.shareAmount;
            resource2.quantity = resource2.quantity - this.shareAmount;
            partnerResource2.quantity = partnerResource2.quantity + this.shareAmount;
            person.tradedWith.push(partner);
          }
        }
      }
    }
  };

  calculateResourceStatus(person) {
    const resources = person.resources;
    Object.keys(person.resources).forEach((resourceName) => {
      const resource = person.resources[resourceName];

      resource.status = 'stable';
      if (resources.quantity >= this.highStock) {
        resource.status = 'tradable';
      }
      if (resources.status <= this.lowStock) {
        resource.status = 'needed';
      }
    });
  }

  harvest() {
    this.people.forEach((person) => {
      if (person.alive === false) return;
      Object.keys(person.resources).forEach((resourceName) => {
        const resource = person.resources[resourceName];
        resource.quantity = resource.quantity + resource.perTurn;
        // this.setHighestResource(resource);
      });
    });
  }

  consume() {
    this.people.forEach((person) => {
      if (person.alive === false) return;

      Object.keys(person.resources).forEach((resourceName) => {
          const resource = person.resources[resourceName];
          resource.quantity = resource.quantity - this.consumptionPerTurn;
          if (resource.quantity < 0) {
            person.alive = false;
            person.tradedWith = [];
          }
      });
    });


    // Object.keys(this.peakResources).forEach((resourceName) => {
    //   const resource = person.resources[resourceName];
    //   resource -= this.consumptionPerTurn;
    // });
  }

  // setHighestResource(personResource) {
  //   const peakResource = this.peakResources[personResource.name];
  //   if (personResource.quantity > peakResource.quantity) {
  //     peakResource.quantity = personResource.quantity;
  //   }
  // }

  populate() {
    let index = 0;
    for(let countX = 0; countX < this.populationRoot; countX++) {
      for(let countY = 0; countY < this.populationRoot; countY++) {
        this.people.push({
          name: `${countX}-${countY}`,
          index: index,
          countX: countX,
          countY: countY,
          resources: this.resources.generatePersonsResources(),
          alive: true,
          resourceStatus: {},
          money: 100,
          tradedWith: [],
        });
        index++;
      }
    }
  }


}
