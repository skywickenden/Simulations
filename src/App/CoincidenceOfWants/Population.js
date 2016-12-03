import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

export default class Population {

  populationCount = 0;
  populationRoot = 0;
  clockSpeed = null;
  people = [];
  peakResources = {
    food: 0,
    clothing: 0,
    shelter: 0,
  };
  resourcesPerTurn = 15;
  consumptionPerTurn = 2;
  shareAmount = 2;
  highStock = 100;
  lowStock = 20;
  itteration = 0;

  constructor(populationRoot, clockSpeed) {
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

      person.trader = false;
      person.tradee = false;
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
    this.sellFood(person, partnerTop);
    this.sellFood(person, partnerBottom);
    this.sellFood(person, partnerLeft);
    this.sellFood(person, partnerRight);

    this.sellClothes(person, partnerTop);
    this.sellClothes(person, partnerBottom);
    this.sellClothes(person, partnerLeft);
    this.sellClothes(person, partnerRight);

    this.sellShelter(person, partnerTop);
    this.sellShelter(person, partnerBottom);
    this.sellShelter(person, partnerLeft);
    this.sellShelter(person, partnerRight);
  }

  buyFromPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    this.buyFood(person, partnerTop);
    this.buyFood(person, partnerBottom);
    this.buyFood(person, partnerLeft);
    this.buyFood(person, partnerRight);

    this.buyClothes(person, partnerTop);
    this.buyClothes(person, partnerBottom);
    this.buyClothes(person, partnerLeft);
    this.buyClothes(person, partnerRight);

    this.buyShelter(person, partnerTop);
    this.buyShelter(person, partnerBottom);
    this.buyShelter(person, partnerLeft);
    this.buyShelter(person, partnerRight);
  }

  sellFood(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.food >= this.highStock) {
      if (partner.resources.food < this.highStock) {
        if (partner.resources.money >= this.highStock) {
          person.resources.food -= this.shareAmount;
          partner.resources.food += this.shareAmount;
          person.resources.money += this.shareAmount;
          partner.resources.money -= this.shareAmount;
          person.trader = true;
          partner.tradee = true;
        }
      }
    }
  }

  buyFood(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.food <= this.highStock) {
      // if (partner.resources.food >= this.lowStock) {
        if (person.resources.money >= this.lowStock) {
          person.resources.food += this.shareAmount;
          partner.resources.food -= this.shareAmount;
          person.resources.money -= this.shareAmount;
          partner.resources.money += this.shareAmount;
          person.trader = true;
          partner.tradee = true;
        }
      // }
    }
  }

  sellClothes(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.clothes >= this.highStock) {
      if (partner.resources.clothes < this.highStock) {
        if (partner.resources.money >= this.highStock) {
          person.resources.clothes -= this.shareAmount;
          partner.resources.clothes += this.shareAmount;
          person.resources.money += this.shareAmount;
          partner.resources.money -= this.shareAmount;
          person.trader = true;
          partner.tradee = true;
        }
      }
    }
  }

  buyClothes(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.clothes <= this.highStock) {
      // if (partner.resources.clothes >= this.lowStock) {
        if (person.resources.money >= this.lowStock) {
          person.resources.clothes += this.shareAmount;
          partner.resources.clothes -= this.shareAmount;
          person.resources.money -= this.shareAmount;
          partner.resources.money += this.shareAmount;
          person.trader = true;
          partner.tradee = true;
        }
      // }
    }
  }

  sellShelter(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.shelter >= this.highStock) {
      // if (partner.resources.shelter <= this.highStock) {
        if (partner.resources.money >= this.highStock) {
          person.resources.shelter -= this.shareAmount;
          partner.resources.shelter += this.shareAmount;
          person.resources.money += this.shareAmount;
          partner.resources.money -= this.shareAmount;
          person.trader = true;
          partner.tradee = true;
        }
      // }
    }
  }

  buyShelter(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.shelter <= this.highStock) {
      if (partner.resources.shelter >= this.lowStock) {
        if (person.resources.money >= this.lowStock) {
          person.resources.shelter += this.shareAmount;
          partner.resources.shelter -= this.shareAmount;
          person.resources.money -= this.shareAmount;
          partner.resources.money += (this.shareAmount * 11);
          person.trader = true;
          partner.tradee = true;
        }
      }
    }
  }

  shareWithPartners(person, partnerTop, partnerBottom, partnerLeft, partnerRight) {
    this.shareFood(person, partnerTop);
    this.shareFood(person, partnerBottom);
    this.shareFood(person, partnerLeft);
    this.shareFood(person, partnerRight);

    this.shareClothes(person, partnerTop);
    this.shareClothes(person, partnerBottom);
    this.shareClothes(person, partnerLeft);
    this.shareClothes(person, partnerRight);

    this.shareShelter(person, partnerTop);
    this.shareShelter(person, partnerBottom);
    this.shareShelter(person, partnerLeft);
    this.shareShelter(person, partnerRight);
  }

  shareFood(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.food <= this.lowStock) {
      if (partner.resources.food >= this.highStock) {
        if (person.resources.shelter >= this.highStock) {
          if (partner.resources.shelter <= this.lowStock) {
            person.resources.food += this.shareAmount;
            partner.resources.food -= this.shareAmount;
            person.resources.shelter -= this.shareAmount;
            partner.resources.shelter += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        } else if (person.resources.clothes >= this.highStock) {
          if (partner.resources.clothes <= this.lowStock) {
            person.resources.food += this.shareAmount;
            partner.resources.food -= this.shareAmount;
            person.resources.clothes -= this.shareAmount;
            partner.resources.clothes += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        }
      }
    }
  }

  shareClothes(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.clothes <= this.lowStock) {
      if (partner.resources.clothes >= this.highStock) {
        if (person.resources.shelter >= this.highStock) {
          if (partner.resources.shelter <= this.lowStock) {
            person.resources.clothes += this.shareAmount;
            partner.resources.clothes -= this.shareAmount;
            person.resources.shelter -= this.shareAmount;
            partner.resources.shelter += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        } else if (person.resources.food >= this.highStock) {
          if (partner.resources.food <= this.lowStock) {
            person.resources.clothes += this.shareAmount;
            partner.resources.clothes -= this.shareAmount;
            person.resources.food -= this.shareAmount;
            partner.resources.food += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        }
      }
    }
  }

  shareShelter(person, partner) {
    if(partner.alive ===false) return;
    if (person.resources.shelter <= this.lowStock) {
      if (partner.resources.shelter >= this.highStock) {
        if (person.resources.food >= this.highStock) {
          if (partner.resources.food <= this.lowStock) {
            person.resources.shelter += this.shareAmount;
            partner.resources.shelter -= this.shareAmount;
            person.resources.food -= this.shareAmount;
            partner.resources.food += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        } else if (person.resources.clothes >= this.highStock) {
          if (partner.resources.clothes <= this.lowStock) {
            person.resources.shelter += this.shareAmount;
            partner.resources.shelter -= this.shareAmount;
            person.resources.clothes -= this.shareAmount;
            partner.resources.clothes += this.shareAmount;
            person.trader = true;
            partner.tradee = true;
          }
        }
      }
    }
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
        person.trader = false;
        person.tradee = false;
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
    const money = parseInt(startingGuassian(), 10);
    this.setHighestResource(food, clothing, shelter);
    return {
      food,
      clothing,
      shelter,
      money,
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
        this.people.push({
          name: `${countX}-${countY}`,
          index: index,
          countX: countX,
          countY: countY,
          resources: this.generatePersonsStartingResources(),
          perTurnResources: this.generatePerTurnResources(),
          alive: true,
          resourceStatus: {},
        });
        index++;
      }
    }
  }


}
