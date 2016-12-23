import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

export default class Population {

  populationCount = 0;
  populationRoot = 0;
  clockSpeed = null;
  people = [];
  startingMoney = 200;
  peakResources = {
    food: 0,
    clothing: 0,
    shelter: 0,
  };
  resourcesPerTurn = 15;
  consumptionPerTurn = 2;
  chanceOfGoldMine = 0.1;
  goldMinePerTurn = 5;
  maxWealth = 0;
  shareAmount = 2;
  highStock = 100;
  lowStock = 50;
  itteration = 0;
  totalDead = 0;

  constructor(populationRoot, clockSpeed) {
    this.populationRoot = populationRoot;
    this.populationCount = populationRoot * populationRoot;
    this.clockSpeed = clockSpeed;
    this.populate();
    this.main();
  }

  tickTock() {
    setTimeout(() => {
      this.main();
    }, this.clockSpeed);
  }

  main() {
    this.harvest();
    this.resetTradedWith();
    this.trade('share');
    this.trade('buy');
    this.trade('sell');
    this.consume();
    this.itteration++;
    this.tickTock();
  }

  resetTradedWith() {
    this.people.forEach((person) => {
      person.soldTo = [];
      person.boughtFrom = [];
      person.sharedWith = [];
    });
  }

  trade(tradeType) {
    const tradeList = [];
    this.people.forEach((person) => {
      if (person.alive === false) return;
      // this.calculateResourceStatus(person);
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
    this.sellResources(person, partnerTop);
    this.sellResources(person, partnerBottom);
    this.sellResources(person, partnerLeft);
    this.sellResources(person, partnerRight);
  }

  sellResources(person, partner) {
    if(partner.alive ===false) return;
    Object.keys(person.resources).forEach((resourceName) => {
      const resource = person.resources[resourceName];
      const partnerResource = partner.resources[resourceName];
      if (resource >= this.highStock) {
        if (partnerResource < this.highStock) {
          if (partner.money > 0) {
            const partnerWanted = this.highStock - partner.resources[resourceName];
            const personAvailable = person.resources[resourceName] - this.highStock;
            const shareAmount = Math.min(partnerWanted, personAvailable, partner.money);
            person.resources[resourceName] -= shareAmount;
            partner.resources[resourceName] += shareAmount;
            person.money += shareAmount;
            partner.money -= shareAmount;
            person.soldTo.push(partner);
          }
        }
      }
    });
  }

  buyFromPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    this.buyResources(person, partnerTop);
    this.buyResources(person, partnerBottom);
    this.buyResources(person, partnerLeft);
    this.buyResources(person, partnerRight);
  }

  buyResources(person, partner) {
    if(partner.alive ===false) return;
    Object.keys(person.resources).forEach((resourceName) => {
      const resource = person.resources[resourceName];
      const partnerResource = partner.resources[resourceName];
      if (resource <= this.lowStock) {
        if (partnerResource >= this.highStock) {
          if (person.money > 0) {
            const personWanted = this.lowStock - person.resources[resourceName];
            const partnerAvailable = partner.resources[resourceName] - this.highStock;
            const shareAmount = Math.min(personWanted, partnerAvailable, person.money);
            person.resources[resourceName] += shareAmount;
            partner.resources[resourceName] -= shareAmount;
            person.money -= shareAmount;
            partner.money += shareAmount;
            person.boughtFrom.push(partner);
          }
        }
      }
    });
  }

  shareWithPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    this.shareResources(person, partnerTop);
    this.shareResources(person, partnerBottom);
    this.shareResources(person, partnerLeft);
    this.shareResources(person, partnerRight);
  }

  shareResources(person, partner) {
    if(partner.alive ===false) return;
    Object.keys(person.resources).forEach((resourceName) => {
      Object.keys(partner.resources).forEach((partnerResourceName) => {
        if (resourceName === partnerResourceName) return;
        if (person.resources[resourceName] <= this.lowStock) {
          if (partner.resources[resourceName] >= this.highStock) {
            if (partner.resources[partnerResourceName] <= this.lowStock) {
              if (person.resources[partnerResourceName] >= this.highStock) {
                const personWanted = this.lowStock - person.resources[resourceName];
                const partnerAvailable = partner.resources[resourceName] - this.highStock;
                const partnerWanted = this.lowStock - partner.resources[partnerResourceName];
                const personAvailable = person.resources[partnerResourceName] - this.highStock;
                const shareAmount = Math.min(personWanted, partnerAvailable, partnerWanted, personAvailable);
                person.resources[resourceName] += shareAmount;
                person.resources[resourceName] -= shareAmount;
                person.resources[partnerResourceName] -= shareAmount;
                person.resources[partnerResourceName] += shareAmount;
                person.sharedWith.push(partner);
              }
            }
          }
        }
      });
    });
  }

  calculateResourceStatus(person) {
    const resources = person.resources;
    let food = 'stable';
    let clothes = 'stable';
    let shelter = 'stable';
    if (resources.food >= this.highStock) {
      food = 'tradable';
      clothes = 'tradable';
      shelter = 'tradable';
    }
    if (resources.food <= this.lowStock) {
      food = 'needed';
      clothes = 'needed';
      shelter = 'needed';
    }
    person.resourceStatus = {
      food,
      clothes,
      shelter,
    };
  }

  harvest() {
    this.maxWealth = 0;
    this.people.forEach((person) => {
      if (person.alive === false) return;

      person.resources.food += person.perTurnResources.food;
      person.resources.clothing += person.perTurnResources.clothing;
      person.resources.shelter += person.perTurnResources.shelter;
      this.setHighestResource(
        person.resources.food,
        person.resources.clothing,
        person.resources.shelter
      );
      if (person.goldMine === true) {
        person.money += this.goldMinePerTurn;
      }
      if (person.money > this.maxWealth) {
        this.maxWealth = person.money;
      }
    });
  }

  consume() {
    this.people.forEach((person) => {
      if (person.alive === false) return;

      const resources = person.resources;
      resources.food -= this.consumptionPerTurn;
      resources.food = resources.food < 0 ? 0 : resources.food;
      resources.clothing -= this.consumptionPerTurn;
      resources.clothing = resources.clothing < 0 ? 0 : resources.clothing;
      resources.shelter -= this.consumptionPerTurn;
      resources.shelter = resources.shelter < 0 ? 0 : resources.shelter;

      // If any resource runs out, then person dies.
      if (resources.food === 0 || resources.clothing === 0 || resources.shelter === 0) {
        person.alive = false;
        this.totalDead++;
        person.soldTo = [];
        person.boughtFrom = [];
        person.sharedWith = [];
      }
    });

    this.peakResources = {
      food: this.peakResources.food -= this.consumptionPerTurn,
      clothing: this.peakResources.clothing -= this.consumptionPerTurn,
      shelter: this.peakResources.shelter -= this.consumptionPerTurn,
    };
  }

  setHighestResource(food, clothing, shelter) {
    if (food > this.peakResources.food) this.peakResources.food = food;
    if (clothing > this.peakResources.clothing) this.peakResources.clothing = clothing;
    if (shelter > this.peakResources.shelter) this.peakResources.shelter = shelter;
  }

  generatePersonsStartingResources() {
    const startingGuassian = gaussian(60, 10);
    const food = parseInt(startingGuassian(), 10);
    const clothing = parseInt(startingGuassian(), 10);
    const shelter = parseInt(startingGuassian(), 10);
    this.setHighestResource(food, clothing, shelter);
    return {
      food,
      clothing,
      shelter,
    };
  }

  generatePerTurnResources() {
    const primaryResources = parseInt(random() * this.resourcesPerTurn, 10);
    const remainingResources = this.resourcesPerTurn - primaryResources;
    let secondaryResources = parseInt(random() * remainingResources, 10);
    let tertiaryResources = remainingResources - secondaryResources;

    const qtyOfResources = 3;
    const primaryOrder = parseInt(random() * qtyOfResources, 10);

    const secondaryOrder = parseInt(random() * 2, 10);
    if (secondaryOrder < 1) {
      const tmp = secondaryResources;
      secondaryResources = tertiaryResources;
      tertiaryResources = tmp;
    }

    let foodPerTurn = 0;
    let clothingPerTurn = 0;
    let shelterPerTurn = 0;
    switch(primaryOrder) {
      case 0:
        foodPerTurn = primaryResources;
        clothingPerTurn = secondaryResources;
        shelterPerTurn = tertiaryResources;
        break;

      case 1:
        clothingPerTurn = primaryResources;
        foodPerTurn = secondaryResources;
        shelterPerTurn = tertiaryResources;
        break;

      case 2:
        shelterPerTurn = primaryResources;
        clothingPerTurn = secondaryResources;
        foodPerTurn = tertiaryResources;
        break;

      default:
        throw new Error('invalid resource order');
    }
    return {
      food: foodPerTurn,
      clothing: clothingPerTurn,
      shelter: shelterPerTurn,
    };
  }

  populate() {
    let index = 0;
    for(let countX = 0; countX < this.populationRoot; countX++) {
      for(let countY = 0; countY < this.populationRoot; countY++) {
        const person = {
          name: `${countX}-${countY}`,
          index: index,
          countX: countX,
          countY: countY,
          resources: this.generatePersonsStartingResources(),
          money: this.startingMoney,
          goldMine: Math.random() < this.chanceOfGoldMine ? true : false,
          perTurnResources: this.generatePerTurnResources(),
          alive: true,
          resourceStatus: {},
          soldTo: [],
          boughtFrom: [],
          sharedWith: [],
        };
        this.people.push(person);
        index++;
      }
    }
  }


}
