import React, { Component } from 'react';

import gaussian from './../../libraries/gaussian';
import random from './../../libraries/random';

import './People.css';

export default class People extends Component {

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
  maxFoodLand = 20;
  maxFoodCarried = 100;
  landFoodPerTick = 1;
  normalWalkSpeed = 0.1; // In world units
  daysInYear = 360;
  daysInMonth = 30;
  daysFertile = 5;
  pubertyAge = 13;
  menopauseAge = 45;
  energyFromFood = 200;
  minParentFood = 3;
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

  landCanvas = null;
  landContext = null;
  landWidth = 20;
  landHeight = 20;
  land = [];
  landWidthUnitPixels = 30;
  landHeightUnitPixels = 30;
  personRadius = 5;

  year= 0;
  day = 0;
  lastFrameDrawnTimestamp = 0;
  maxLoopsOnPeddleToTheMetal = 10;
  peddleToTheMetalCount = 0;

  state = {
    clockSpeed: 1000,
    itteration: 0,
    showPersonDetails: false,
    msPerFrameDrawn: 100,
  };

  componentWillMount() {
    for (let x = 0; x <= this.landWidth; x++) {
      this.land[x] = [];
      for (let y = 0; y <= this.landHeight; y++) {
        this.land[x][y] = this.maxFoodLand;
      }
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
      fertilityRate: fertilityGuassian(),
      personalityType: random(), // closer numbers are more compaitible - rolls over from 1 to 0.
      pregnant: false,
      mate: null,
      relationships: {}, // indexed by person id , contians object {friend:int, potentialMate:int}
      father: null,
      mother: null,
      children: [],
      position: {
        x: random() * this.landWidth, // In world units, not pixels
        y: random() * this.landWidth, // In world units, not pixels
      },
      walkDirection: null, // North, East, South, West
      walkSpeed: 0, // In world units
      walkStepQuantity: 0,
      traits: {
        feelsHunger: startingGuassian(),
        forageSkill: startingGuassian(),
      },
    };
    this.personCount += 1;
    this.isFertile(person);
    return person;
  }

  componentDidMount() {
    this.landCanvas = document.getElementById('land');
    this.landContext = this.landCanvas.getContext('2d');
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
      if (foodForaged > this.land[landX][landY]) {
        foodForaged = this.land[landX][landY];
        person.enoughFoodForaged = false;
      } else {
        person.enoughFoodForaged = true;
      }
      this.land[landX][landY] -= foodForaged;
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
      if (parentWithMost && parentWithMost.food > this.minParentFood) {
        parentWithMost.food -= 1;
        person.food += 1;
      }
    }

    this.consumeFood(person);
  }

  isItTimeToWalkabout(person) {
    if (person.enoughFoodForaged === false && person.walkStepQuantity === 0) {
      const walkDirectionRND = parseInt(random() * 4, 10);
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
          person.walkDirection = 'East';
          break;
        default:
          console.error('walkDirectionRND error', walkDirectionRND);
      }
      person.walkSpeed = this.normalWalkSpeed;
      person.walkStepQuantity = 1 / this.normalWalkSpeed; // one world unit.
    }

    if (person.walkDirection && person.walkSpeed > 0 && person.walkStepQuantity > 0) {
      person.walkStepQuantity -= 1;
      switch(person.walkDirection) {
        case 'North':
          person.position.y -= person.walkSpeed;
          break;
        case 'West':
          person.position.x -= person.walkSpeed;
          break;
        case 'South':
          person.position.y += person.walkSpeed;
          break;
        case 'East':
          person.position.x += person.walkSpeed;
          break;
        default:
          console.error('person.walkDirection error', person.walkDirection);
      }

      // loop the persons position on the canvas from left to right and top to bottom.
      if (person.position.y < 0) person.position.y += this.landHeight;
      if (person.position.y > this.landHeight) person.position.y -= this.landHeight;
      if (person.position.x < 0) person.position.x += this.landWidth;
      if (person.position.x > this.landWidth) person.position.x -= this.landWidth;
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

  foodGrows() {
    for (let y = 0; y < this.landHeight; y++) {
      for (let x = 0; x < this.landWidth; x++) {
        this.land[x][y] += this.landFoodPerTick;
        if (this.land[x][y] > this.maxFoodLand) this.land[x][y] = this.maxFoodLand;
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
        if (person.id === 165 && relationshipDistance > 0) {
          console.log('person 165d +mate', person2.id, relationshipDistance);
        }
        const relationship = {
          friend: 0,
          potentialMate: 0,
          relationshipDistance,
        };
         person.relationships[person2.id] = relationship;
         person2.relationships[person.id] = relationship;
      }

      const relationship = person.relationships[person2.id];
      if (person.id === 165 && person2.id === 189) {
        console.log('person 165d +mate', person2.id, relationship);
      }

      if (person.age > this.pubertyAge && person2.age > this.pubertyAge) {
        if ((person.sex === 'Female' && person2.sex === 'Male')
          || (person2.sex === 'Female' && person.sex === 'Male')
        ) {
          // relationship.potentialMate += parseInt(relationship.relationshipDistance * 10, 10);
          relationship.potentialMate += relationship.relationshipDistance * 10;
          if (person.id === 165) {
            console.log('person 165c +mate', person2.id, relationship.potentialMate);
          }
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
        if (person.id === 165) {
          console.log('person 165b', this.people[i].id);
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

  giveBirth(person) {
    person.pregnant = false;
    person.energy -= this.energyToBirth;
    const newPerson = this.createPerson(this.people.length - 1);
    newPerson.position.x = person.position.x;
    newPerson.position.y = person.position.y;
    newPerson.age = 0;
    newPerson.fertile = false;
    this.people.push(newPerson);

    person.children.push(newPerson);
    newPerson.mother = person;
    if (person.mate) person.mate.children.push(newPerson);
    newPerson.father = person.mate;
  }

  ifStarving(person) {
    // if ()
    // @todo use relationships to take food.
  }

  drawLand() {
    this.landContext.fillStyle = 'rgb(200, 200, 0)';
    this.landContext.fillRect(
      0,
      0,
      this.landWidth * this.landWidthUnitPixels,
      this.landHeight * this.landHeightUnitPixels
    );
    for (let y = 0; y < this.landHeight; y++) {
      for (let x = 0; x < this.landWidth; x++) {
        const startX = x * this.landWidthUnitPixels + 1;
        const endX = this.landWidthUnitPixels - 1;
        const startY = y * this.landHeightUnitPixels + 1;
        const endY = this.landHeightUnitPixels - 1;
        let green = parseInt(this.land[x][y] / this.maxFoodLand * 255, 10);
        if (green > 255) green  = 255;
        this.landContext.fillStyle =  `rgb(0, ${green}, 0)`;
        this.landContext.fillRect(startX, startY, endX, endY);
      }
    }

    this.people.forEach((person) => {
      const x = parseInt(person.position.x * this.landWidthUnitPixels, 10);
      const y = parseInt(person.position.y * this.landHeightUnitPixels, 10);

      this.landContext.beginPath();
      // this.landContext.strokeStyle = 'rgb(0, 0, 155)';
      this.landContext.fillStyle = 'rgb(100, 100, 255)';
      if (this.state.showPersonDetails.id === person.id) {
        this.landContext.fillStyle = 'rgb(255, 100, 100)';
      }
      this.landContext.arc(x, y, this.personRadius, 0, 2 * Math.PI, false);
      this.landContext.fill();
      this.landContext.closePath();
    });
  }

  oneDay() {
    let index = this.people.length - 1;
    while (index >= 0) {
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

      index -= 1;
    }

    this.foodGrows();

    if (this.day === this.daysInYear) {
      this.year++;
      this.day = 0;
    } else {
      this.day++;
    }
    if (Date.now() - this.state.msPerFrameDrawn > this.lastFrameDrawnTimestamp) {
      this.lastFrameDrawnTimestamp = Date.now();
      this.setState({itteration: this.state.itteration + 1});
      this.drawLand();
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
    this.setState({showPersonDetails: false});
  }

  openDetails(person) {
    this.setState({showPersonDetails: person});
  }

  setFrameRedrawRate(rate) {
    this.setState({msPerFrameDrawn: rate});
  }

  landClicked(event) {
    const rect = this.landCanvas.getBoundingClientRect();
    const clickX = parseInt(event.clientX - rect.left, 10);
    const clickY = parseInt(event.clientY - rect.top, 10);
    this.people.forEach((person) => {
      const personX = person.position.x * this.landWidthUnitPixels;
      const personY = person.position.y * this.landHeightUnitPixels;

      // quick check to see if in the person rectangle.
      if (clickX > personX - this.personRadius
        && clickX < personX + this.personRadius
        && clickY > personY - this.personRadius
        && clickY < personY + this.personRadius
      ) {
        // Now a more detailed check to make sure it is inside the circle.
        this.landContext.beginPath();
        this.landContext.fillStyle = 'rgb(0, 0, 155)';
        this.landContext.arc(personX, personY, this.personRadius, 0, 2 * Math.PI, false);
        this.landContext.fill();
        const inPerson = this.landContext.isPointInPath(clickX, clickY);
        this.landContext.closePath();
        if (inPerson) {
          this.setState({showPersonDetails: person});
        }
      }
    });

  }

  render() {
    const personDetails = this.state.showPersonDetails;
    return (
      <div className="people">
        {this.state.showPersonDetails ? (
          <div className="personDetailsOn">
            <button className="close" onClick={this.closeDetailsClicked.bind(this)}>X</button>
            <div>Name: {personDetails.name}</div>
            <div className="attributes">
              <div>Sex:  </div>
              <div>Fertility rate {personDetails.fertilityRate}</div>
              <div>Mate {personDetails.mate ? personDetails.mate.name : 'none'}</div>
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
                      onClick={this.openDetails.bind(this, child)}>
                      {child.name}
                    </div>
                  </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : '' }

        <canvas
          id="land"
          className="land"
          width={this.landWidth * this.landWidthUnitPixels}
          height={this.landHeight * this.landHeightUnitPixels}
          onClick={this.landClicked.bind(this)}
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