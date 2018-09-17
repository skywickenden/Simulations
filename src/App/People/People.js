import React, { Component } from 'react';

import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

import Land from './Land';

import './People.css';

export default class People extends Component {

  tribeLand;
  config = {
    land: {
      landWidth: 20,
      landHeight: 20,
      land: [],
      landWidthUnitPixels: 30,
      landHeightUnitPixels: 30,
      personRadius: 5,
      landFoodPerTick: 1,
      maxFoodLand: 20,
    }
  };

  people  = [];
  personCount = 0;
  initialPopulation = 100;
  activities = [
    'resting',
    'socialising',
    'hunting',
  ];
  health = {
    healthy: 1,
    dead: 0,
  };
  baseHunger = 500;
  maxFoodToForagePerPerson = 10;
  maxFoodCarried = 100;
  normalWalkSpeed = 0.1; // In world units
  daysInYear = 360;
  daysInMonth = 30;
  daysFertile = 5;
  pubertyAge = 13;
  menopauseAge = 45;
  energyFromFood = 200;
  minParentFood = 40;
  energyToBreathForADay = 50;
  minEnergyToHaveSex = 200;
  energyToHaveSex = 70;
  energyToForage = 80;
  pregnancyTime = 270;
  energyPerSocialEncounter = 10;
  minEnergyToSocialise = 100;
  potentialMateBecomesMate = 100;
  energyToBirth = 200;
  ageAtDeath = 60;

  tribes = [];

  year = 0;
  day = 0;
  lastFrameDrawnTimestamp = 0;
  maxLoopsOnPeddleToTheMetal = 10;
  peddleToTheMetalCount = 0;

  widthIndex = [];
  heightIndex = [];

  state = {
    clockSpeed: 1000,
    itteration: 0,
    showPersonDetails: false,
    showChild: false,
    msPerFrameDrawn: 100,
  };

  componentWillMount() {
    this.tribeLand = new Land(this.config.land);

    for (let i = 0; i < this.tribeLand.getLandWidth(); i++) {
      this.widthIndex[i] = [];
    }
    for (let i = 0; i < this.tribeLand.getLandHeight(); i++) {
      this.heightIndex[i] = [];
    }

    for (let i = 0; i <= this.initialPopulation; i++) {
      const person = this.createPerson();
      this.people.push(person);
    }
  }

  createPerson() {
    const startingGuassian = gaussian(0.5, 0.125, 0.01, 0.99);
    const ageGuassian = gaussian(30, 5, 15, 50);
    const fertilityGuassian = gaussian(0.2, 0.04, 0, 1);
    const person = {
      name: 'person ' + this.personCount,
      id: this.personCount,
      food: 10,
      enoughFoodForaged: true,
      energy: 100,
      age: parseInt(ageGuassian(), 10),
      birthday: parseInt(random() * this.daysInYear, 10),
      activity: this.activities[0],
      health: this.health.healthy,
      sex: random() > 0.5 ? 'Male' : 'Female',
      fertilityRate: 0.15, // fertilityGuassian(),
      personalityType: random(), // closer numbers are more compaitible - rolls over from 1 to 0.
      pregnant: false,
      mate: null,
      relationships: {}, // indexed by person id , contians object {friend:int, potentialMate:int}
      father: null,
      mother: null,
      children: [],
      position: {
        x: random() * this.tribeLand.getLandWidth(), // In world units, not pixels
        y: random() * this.tribeLand.getLandHeight(), // In world units, not pixels
      },
      walkDirection: null, // North, East, South, West
      walkSpeed: 0, // In world units
      walkStepQuantity: 0,
      traits: {
        feelsHunger: 0.5,// startingGuassian(),
        forageSkill: 0.5, // startingGuassian(),
      },
    };
    console.log('person.position.x',person.position.x);
    this.widthIndex[parseInt(person.position.x, 10)].push(person.id);
    this.heightIndex[parseInt(person.position.y, 10)].push(person.id);
    this.personCount += 1;
    this.isFertile(person);
    return person;
  }

  componentDidMount() {
    this.tribeLand.setCanvas(document.getElementById('land'));
    this.tickTock();
  }

  consumeFood(person) {
    while (person.energy <= this.baseHunger * person.traits.feelsHunger && person.food > 0) {
      person.food -= 1;
      person.energy += this.energyFromFood;
    }

    if (person.energy <= 0) {
      person.health -= 0.1;
    }
  }

  isItTimeToDie(person, index) {
    if (person.health < -1) {
      this.timeToDie(person, index);
    }
  }

  timeToDie(person, index) {
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
    this.removePositionIndex(person);
    this.people.splice(index, 1);
  }

  isItTimeToForage(person) {
    if (person.age > this.pubertyAge
      && person.energy > this.energyToForage
      && person.food < this.maxFoodCarried
    ) {
      let foodForaged = parseInt(this.maxFoodToForagePerPerson * person.traits.forageSkill, 10);
      const landX = parseInt(person.position.x, 10);
      const landY = parseInt(person.position.y, 10);
      if (foodForaged > this.tribeLand.getCellFood(landX, landY)) {
        foodForaged = this.tribeLand.getCellFood(landX, landY);
        person.enoughFoodForaged = false;
      } else {
        person.enoughFoodForaged = true;
      }
      this.tribeLand.removeFoodFromCell(landX, landY, foodForaged);
      person.food += foodForaged;
      person.energy -= this.energyToForage;
    }

    if (person.age <= this.pubertyAge && person.food < this.maxFoodCarried) {
      let parentWithMost;
      if (person.mother) parentWithMost = person.mother;
      if (person.father) {
        if (person.mother) {
          if (person.mother && person.father.food > person.mother.food) {
            parentWithMost = person.father;
          }
        } else {
          parentWithMost = person.father;
        }
      }
      if (person.id == 508) {console.log(person.name, parentWithMost.food);}
      if (parentWithMost && parentWithMost.food > this.minParentFood) {
        parentWithMost.food -= 1;
        person.food += 1;
      }
    }

    this.consumeFood(person);
  }

  isItTimeToWalkabout(person) {
    if (person.enoughFoodForaged === false
      && person.walkStepQuantity === 0
      && person.age > this.pubertyAge
    ) {
      const rand = random();
      const walkDirectionRND = parseInt(rand * 4, 10);
      switch(walkDirectionRND) {
        case 0:
          person.walkDirection = 'North';
          break;
        case 1:
          person.walkDirection = 'West';
          break;
        case 2:
          person.walkDirection = 'South';
          break;
        case 3:
        case 4:
          person.walkDirection = 'East';
          break;
        default:
          console.error('walkDirectionRND error', walkDirectionRND, rand);
      }
      person.walkSpeed = this.normalWalkSpeed;
      person.walkStepQuantity = 1 / this.normalWalkSpeed; // one world unit.
      person.children.forEach((child) => {
        if (child.mother && person && child.mother.id === person.id) {
          child.walkDirection = person.walkDirection;
          child.walkSpeed = person.walkSpeed;
          child.walkStepQuantity = person.walkStepQuantity; // one world unit.
        }
      });
    }

    if (person.walkDirection
      && person.walkSpeed > 0
      && person.walkStepQuantity > 0
      && person.age > this.pubertyAge
    ) {
      person.walkStepQuantity -= 1;
      let xWalkSpeed = 0;
      let yWalkSpeed = 0;
      switch(person.walkDirection) {
        case 'North':
          yWalkSpeed -= person.walkSpeed;
          break;
        case 'West':
          xWalkSpeed -= person.walkSpeed;
          break;
        case 'South':
          yWalkSpeed += person.walkSpeed;
          break;
        case 'East':
          xWalkSpeed += person.walkSpeed;
          break;
        default:
      }
      this.removePositionIndex(person);
      person.position.x += xWalkSpeed;
      person.position.y += yWalkSpeed;
      person.children.forEach((child) => {
        if (child.mother && person && child.mother.id === person.id) {
          child.position.x += xWalkSpeed;
          child.position.y += yWalkSpeed;
        }
      });

      // loop the persons position on the canvas from left to right and top to bottom.
      if (person.position.y < 0) person.position.y += this.tribeLand.getLandHeight();
      if (person.position.y > this.tribeLand.getLandHeight()) {
        person.position.y -= this.tribeLand.getLandHeight();
      }
      if (person.position.x < 0) person.position.x += this.tribeLand.getLandWidth();
      if (person.position.x > this.tribeLand.getLandWidth()) {
        person.position.x -= this.tribeLand.getLandWidth();
      }
      this.insertPositionIndex(person);
    }
  }

  isBirthday(person, index) {
    if (this.day === person.birthday) {
      person.age += 1;
      if (person.age >= this.ageAtDeath) {
        this.timeToDie(person, index);
      }
    }
  }

  isFertile(person) {
    if (person.sex === 'Female') {
      if (person.age > this.pubertyAge && person.age < this.menopauseAge) {
        const months = parseInt((this.day + person.birthday) / this.daysInMonth, 10);
        const days = (this.day + person.birthday) - (months * this.daysInMonth);
        if (days <= this.daysFertile) {
          person.fertile = true;
        } else {
          person.fertile = false;
        }
      } else {
        person.fertile = false;
      }
    } else {
      if (person.age > this.pubertyAge) {
        person.fertile = true;
      } else {
        person.fertile = false;
      }
    }
  }

  haveSex(person) {
    this.isFertile(person);

    if (person.mate) {
      if (person.energy > this.minEnergyToHaveSex
        && person.mate.energy > this.minEnergyToHaveSex
      ) {
        person.energy -= this.energyToHaveSex;
        person.mate.energy -= this.energyToHaveSex;
        const lowestFertilityRate = person.fertilityRate > person.mate.fertilityRate
          ? person.mate.fertilityRate : person.fertilityRate;
        const conception = lowestFertilityRate > random();
        if (conception) {
          if (person.mate.sex === 'Male' && person.sex === 'Female' && person.pregnant === false) {
            person.pregnant = this.pregnancyTime;
          }
          if (person.sex === 'Male' && person.mate.sex === 'Female' && person.mate.pregnant === false) {
            person.mate.pregnant = this.pregnancyTime;
          }
        }
      }
    }
  }

  socialiseWithPerson(person, person2) {
    if (person2.energy > this.minEnergyToSocialise) {
      if (!person.relationships[person2.id]) {

        const distance1 = Math.abs(person.personalityType - person2.personalityType);
        let distance2 = 1, distance3 = 1;
        if (person.personalityType < 0.5 && person2.personalityType > 0.5) {
          distance2 = Math.abs((person.personalityType + 1) - person2.personalityType);
        }
        if (person2.personalityType < 0.5 && person.personalityType > 0.5) {
          distance3 = Math.abs((person2.personalityType + 1) - person.personalityType);
        }
        // negative relationships are dislikes.
        const relationshipDistance = Math.min(distance1, distance2, distance3) - 0.25;
        const relationship = {
          friend: 0,
          potentialMate: 0,
          relationshipDistance,
        };
         person.relationships[person2.id] = relationship;
         person2.relationships[person.id] = relationship;
      }

      const relationship = person.relationships[person2.id];

      if (person.age > this.pubertyAge && person2.age > this.pubertyAge) {
        if ((person.sex === 'Female' && person2.sex === 'Male')
          || (person2.sex === 'Female' && person.sex === 'Male')
        ) {
          // relationship.potentialMate += parseInt(relationship.relationshipDistance * 10, 10);
          relationship.potentialMate += relationship.relationshipDistance * 10;
        }
      }
      relationship.friend += parseInt(relationship.relationshipDistance * 10, 10);


      if (person.mate === null && person2.mate === null
        && relationship.potentialMate > this.potentialMateBecomesMate
      ) {
        person.mate = person2;
        person2.mate = person;
      }
    }
  }

  socialise(person, index) {
    if (person.energy > this.minEnergyToSocialise && person.mate === null && person.age >= this.pubertyAge) {
      for (let i = index + 1; i < this.people.length - 1; i++) {
        if (this.people[i].energy <= this.minEnergyToSocialise
          || this.people[i].mate !== null
          || this.people[i].age < this.pubertyAge
        )  {
          break;
        }
        this.socialiseWithPerson(person, this.people[i]);
      }
      for (let i = 0; i < index; i++) {
        if (this.people[i].energy <= this.minEnergyToSocialise
          || this.people[i].mate !== null
          || this.people[i].age < this.pubertyAge
        )  {
          break;
        }
        this.socialiseWithPerson(person, this.people[i]);
      }
    }
  }

  progressPregnancy(person) {
    if (person.pregnant) {
      person.pregnant -= 1;
      if (person.pregnant < 1) {
        this.giveBirth(person);
      }
    }
  }

  findNewPointFromAngle(x, y, angle, distance) {
      var result = {};
      result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
      result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

      return result;
  }

  giveBirth(person) {
    person.pregnant = false;
    person.energy -= this.energyToBirth;
    const newPerson = this.createPerson(this.people.length - 1);

    const randomAngle = parseInt(random() * 360, 10);
    const distanceFromMother = (this.tribeLand.getPersonRadius() * 2) + parseInt(random() * 5, 10);
    const newPoint = this.findNewPointFromAngle(
      person.position.x * this.tribeLand.getLandWidthUnitPixels(),
      person.position.y * this.tribeLand.getLandHeightUnitPixels(),
      randomAngle,
      distanceFromMother
    );
    newPerson.position.x = newPoint.x / this.tribeLand.getLandWidthUnitPixels();
    newPerson.position.y = newPoint.y / this.tribeLand.getLandHeightUnitPixels();

    newPerson.age = 0;
    newPerson.fertile = false;
    this.people.push(newPerson);

    person.children.push(newPerson);
    newPerson.mother = person;
    if (person.mate) person.mate.children.push(newPerson);
    newPerson.father = person.mate;
  }

  removePositionIndex(person) {
  if (parseInt(person.position.x, 10) >= 0 && parseInt(person.position.x, 10) < 20) {
      this.widthIndex[parseInt(person.position.x, 10)].splice(
        this.widthIndex[parseInt(person.position.x, 10)].indexOf(person.id),
        1
      );
    }
    if (parseInt(person.position.y, 10) >= 0 && parseInt(person.position.y, 10) < 20) {
      this.heightIndex[parseInt(person.position.y, 10)].splice(
        this.heightIndex[parseInt(person.position.y, 10)].indexOf(person.id),
        1
      );
    }
  }

  insertPositionIndex(person) {

    if (parseInt(person.position.y, 10) < 0 || parseInt(person.position.y, 10) >= 20) {
      console.log(person);
    }
    if (parseInt(person.position.x, 10) >= 0 && parseInt(person.position.x, 10) < 20) {
      this.widthIndex[parseInt(person.position.x, 10)].push(person.id);
    }
    if (parseInt(person.position.y, 10) >= 0 && parseInt(person.position.y, 10) < 20) {
      this.heightIndex[parseInt(person.position.y, 10)].push(person.id);
    }
  }

  ifStarving(person) {
    // if ()
    // @todo use relationships to take food.
  }

  oneDay() {
    let index = 0;
    while (index <= this.people.length - 1) {
      const person = this.people[index];
      person.energy -= this.energyToBreathForADay;

      this.isItTimeToForage(person);
      this.isItTimeToWalkabout(person);
      this.ifStarving(person);
      this.isItTimeToDie(person, index);

      this.isBirthday(person, index);
      this.socialise(person, index);
      this.haveSex(person);
      this.progressPregnancy(person);

      index += 1;
    }

    this.tribeLand.growFood();

    if (this.day === this.daysInYear) {
      this.year++;
      this.day = 0;
    } else {
      this.day++;
    }
    if (Date.now() - this.state.msPerFrameDrawn > this.lastFrameDrawnTimestamp) {
      this.lastFrameDrawnTimestamp = Date.now();
      this.setState({itteration: this.state.itteration + 1});
      this.tribeLand.drawLand(
        this.people,
        this.state.showPersonDetails,
        this.state.showChild,
        this.pubertyAge
      );
    }

    if (this.state.clockSpeed === 0) {
      this.peddleToTheMetalCount++;
      if (this.peddleToTheMetalCount > this.maxLoopsOnPeddleToTheMetal) {
        this.peddleToTheMetalCount = 0;
        this.tickTock();
      } else {
        this.oneDay();
      }
    } else {
      this.tickTock();
    }
  }

  tickTock() {
    setTimeout(() => {
      this.oneDay();
    }, this.state.clockSpeed);
  }

  setClockSpeed(newSpeed) {
    this.setState({clockSpeed: newSpeed});
  }

  closeDetailsClicked() {
    this.setState({
      showPersonDetails: false,
      showChild: false,
    });
  }

  openDetails(person) {
    this.setState({showPersonDetails: person});
  }

  childClicked(child) {
    this.setState({showChild: child});
  }

  setFrameRedrawRate(rate) {
    this.setState({msPerFrameDrawn: rate});
  }

  render() {
    const personDetails = this.state.showPersonDetails;
    console.log(this.widthIndex, this.heightIndex);
    return (
      <div className="people">
        {this.state.showPersonDetails ? (
          <div className="personDetailsOn">
            <button className="close" onClick={this.closeDetailsClicked.bind(this)}>X</button>
            <div>Name: {personDetails.name}</div>
            <div className="attributes">
              <div>Sex:  {personDetails.sex}</div>
              <div>Age:  {personDetails.age}</div>
              <div>Fertility rate {personDetails.fertilityRate}</div>
              <div>Mate {personDetails.mate ? (
                  <span className="personOpener" onClick={this.openDetails.bind(this, personDetails.mate)}>
                    {personDetails.mate.name}
                  </span>
                ) : 'none'}</div>
              <div>Pregnant {personDetails.pregnant}</div>
              <div>Food: {personDetails.food}</div>
              <div>Forage Skill: {personDetails.traits.forageSkill}</div>
              <div>Energy: {personDetails.energy}</div>
              <div>Activity: {personDetails.activity}</div>
              <div>Health: {Math.round(personDetails.health * 100) / 100}</div>
            </div>
            <div>
              <div
                className="personOpener"
                onClick={this.openDetails.bind(this, personDetails.mother)}>
                Mother: {personDetails.mother ? personDetails.mother.name : ''}
              </div>
              <div
                className="personOpener"
                onClick={this.openDetails.bind(this, personDetails.father)}>
                Father: {personDetails.father ? personDetails.father.name : ''}
              </div>
              <div>Children:</div>
              <ul>
                {personDetails.children.map((child, index) => {
                  return (
                    <li key={index}>
                      <div
                        className="personOpener"
                        onClick={this.childClicked.bind(this, child)}>
                        {child.name} - ({child.age} {child.food} {child.energy})
                      </div>
                    </li>
                  );
                })}
              </ul>
              {this.state.showChild ? (
                <div>
                  <div>Child: {this.state.showChild.name}</div>
                  <div>Age: {this.state.showChild.age}</div>
                  <div>Food: {this.state.showChild.food}</div>
                  <div>Energy {this.state.showChild.energy}</div>
                </div>
              ) : ''}
              <ul>
                {Object.keys(personDetails.relationships).map((relationshipPersonId) => {
                  const relationship = personDetails.relationships[relationshipPersonId];
                  console.log(relationship);
                  return ('');
                })}
              </ul>
            </div>
          </div>
        ) : '' }

        <canvas
          id="land"
          className="land"
          width={this.tribeLand.getLandWidth() * this.tribeLand.getLandWidthUnitPixels()}
          height={this.tribeLand.getLandHeight() * this.tribeLand.getLandHeightUnitPixels()}
          onClick={this.tribeLand.landClicked.bind(this.tribeLand, this.people, this.openDetails.bind(this))}
          />
        <h4>People</h4>
        <div>
          Set Clock Speed:&nbsp;
          <button
            onClick={this.setClockSpeed.bind(this, 1000)} >
            1000
          </button>
          <button
            onClick={this.setClockSpeed.bind(this, 250)} >
            250
          </button>
          <button
            onClick={this.setClockSpeed.bind(this, 50)} >
            50
          </button>
          <button
            onClick={this.setClockSpeed.bind(this, 5)} >
            5
          </button>
          <button
            onClick={this.setClockSpeed.bind(this, 1)} >
            1
          </button>
          <button
            onClick={this.setClockSpeed.bind(this, 0)} >
            Peddle to the metal!
          </button>
        </div>

        <div>
          Set Frame Redraw rate:&nbsp;
          <button
            onClick={this.setFrameRedrawRate.bind(this, 1000)} >
            1000ms
          </button>
          <button
            onClick={this.setFrameRedrawRate.bind(this, 250)} >
            250ms
          </button>
          <button
            onClick={this.setFrameRedrawRate.bind(this, 100)} >
            100ms
          </button>
          <button
            onClick={this.setFrameRedrawRate.bind(this, 50)} >
            50ms
          </button>
        </div>

        <div>
          Day: {this.day}, Year: {this.year}
        </div>
        <div>
          Population: {this.people.length}
        </div>

        <ul>
          {this.people.map((person, index) => {
            const personClass = person.health >= 0 ? 'alive' : 'dead';
            return <li key={index} className={personClass}>
              <div onClick={this.openDetails.bind(this, person)}>
                {person.name} ({person.sex} {person.age} {person.fertile ? 'Fertile' : ''})
              </div>
            </li>
          })}
        </ul>

      </div>
    );
  }
}
