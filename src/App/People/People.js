import React, { Component } from 'react';

import Land from './Land';

import createPerson from './actions/createPerson';
import findLocalPeople from './actions/findLocalPeople';
import fight from './actions/fight';
import haveSex from './actions/haveSex';
import isBirthday from './actions/isBirthday';
import indexLocalPeople from './actions/indexLocalPeople';
import isItTimeToDie from './actions/isItTimeToDie';
import isItTimeToForage from './actions/isItTimeToForage';
import isItTimeToWalkabout from './actions/isItTimeToWalkabout';
import progressPregnancy from './actions/progressPregnancy';
import socialise from './actions/socialise';
import spawn from './actions/spawn';


import './People.css';

export default class People extends Component {

  config = {
    land: {
      landWidth: 10,
      landHeight: 10,
      land: [],
      landWidthUnitPixels: 30,
      landHeightUnitPixels: 30,
      personRadius: 5,
      landFoodPerTick: 1,
      maxFoodLand: 20,
    },
    initialPopulation: 100,
    baseHunger: 500,
    maxFoodToForagePerPerson: 10,
    maxFoodCarried: 100,
    normalWalkSpeed: 0.1,
    daysInYear: 360,
    daysInMonth: 30,
    daysFertile: 5,
    pubertyAge: 13,
    menopauseAge: 45,
    energyFromFood: 200,
    minParentFood: 40,
    energyToBreathForADay: 50,
    minEnergyToHaveSex: 200,
    energyToHaveSex: 70,
    energyToForage: 80,
    pregnancyTime: 270,
    minEnergyToSocialise: 100,
    potentialMateBecomesMate: 100,
    energyToBirth: 200,
    ageAtDeath: 60,
    spawnMinimum: 300,
    localDistance: 2,
    foodShortage: 10,
    energyLostWhenLosingFighting: 150,
  };

  tribeLand;
  people  = [];
  personCount = { count: 0}; // stored in object to make it easy to pass by reference.
  activities = [
    'resting',
    'socialising',
    'hunting',
  ];
  health = {
    healthy: 1,
    dead: 0,
  };

  tribes = [];

  yearCount = 0;
  dayCount = 0;
  lastFrameDrawnTimestamp = 0;
  maxLoopsOnPeddleToTheMetal = 10;
  peddleToTheMetalCount = 0;

  peopleIndex = [];
  localIndex = [];

  state = {
    clockSpeed: 1000,
    pause: false,
    itteration: 0,
    showPersonDetails: false,
    showChild: false,
    msPerFrameDrawn: 100,
    landSelectedX: null,
    landSelectedY: null,
    landType: 'food', // food, territory
  };

  componentWillMount() {
    this.tribeLand = new Land(this.config.land);

    for (let x = 0; x < this.tribeLand.getLandWidth(); x++) {
      this.peopleIndex[x] = [];
      this.localIndex[x] = [];
      for (let y = 0; y < this.tribeLand.getLandHeight(); y++) {
        this.peopleIndex[x][y] = [];
        this.localIndex[x][y] = [];
      }
    }

    for (let i = 0; i <= this.config.initialPopulation; i++) {
      const person = createPerson(
        this.personCount,
        this.config,
        this.activities,
        this.health,
        this.tribeLand,
        this.peopleIndex,
        this.dayCount
      );
      this.people.push(person);
    }
  }

  componentDidMount() {
    this.tribeLand.setCanvas(document.getElementById('land'));
    this.tickTock();
  }

  oneDay() {
    if (!this.state.pause) {

      let index = 0;
      while (index <= this.people.length - 1) {
        const person = this.people[index];
        person.energy -= this.config.energyToBreathForADay;

        isItTimeToForage(person, this.config, this.tribeLand);
        findLocalPeople(person, 3, this.peopleIndex, this.tribeLand);
        isItTimeToWalkabout(person, this.config, this.peopleIndex, this.tribeLand);
        isItTimeToDie(person, index, this.people, this.peopleIndex);

        isBirthday(person, index, this.config, this.dayCount, this.people, this.peopleIndex, this.personCount);
        socialise(person, index, this.config, this.people);
        haveSex(person, this.config, this.dayCount);
        progressPregnancy(
          person,
          this.config,
          this.personCount,
          this.activities,
          this.health,
          this.tribeLand,
          this.peopleIndex,
          this.dayCount,
          this.people
        );

        index += 1;
      }

      // spawn(
      //   this.personCount,
      //   this.config,
      //   this.activities,
      //   this.health,
      //   this.tribeLand,
      //   this.peopleIndex,
      //   this.dayCount,
      //   this.people
      // );

      indexLocalPeople(this.pepole, this.config, this.localIndex, this.peopleIndex, this.tribeLand);

      fight(this.people, this.localIndex, this.tribeLand, this.config);

      this.tribeLand.growFood();

      if (this.dayCount === this.config.daysInYear) {
        this.yearCount++;
        this.dayCount = 0;
      } else {
        this.dayCount++;
      }

    }

    if (Date.now() - this.state.msPerFrameDrawn > this.lastFrameDrawnTimestamp) {
      this.lastFrameDrawnTimestamp = Date.now();
      this.setState({itteration: this.state.itteration + 1});
      this.tribeLand.drawLand(
        this.people,
        this.state.showPersonDetails,
        this.state.showChild,
        this.config.pubertyAge,
        this.localIndex,
        this.state.landSelectedX,
        this.state.landSelectedY,
        this.state.landType
      );
    }

    if (this.state.clockSpeed === 0 && !this.state.pause) {
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

  setPause() {
    this.setState({pause: !this.state.pause});
  }

  setLandSelected(x, y) {
    this.setState({
      landSelectedX: x,
      landSelectedY: y,
    });
  }

  landTypeChanged(event) {
    this.setState({landType: event.currentTarget.value})
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
                  // const relationship = personDetails.relationships[relationshipPersonId];
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
          onClick={this.tribeLand.landClicked.bind(
            this.tribeLand,
            this.people,
            this.openDetails.bind(this),
            this.setLandSelected.bind(this)
          )}
          />
        <h4>People</h4>
        <div>
          Set Clock Speed:&nbsp;
          <button
            onClick={this.setPause.bind(this)} >
            Pause
          </button>
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
          Land type shown:
          <input
            type="radio" name="landType"
            value="food"
            checked={this.state.landType === 'food'}
            onChange={this.landTypeChanged.bind(this)} /> food

          <input
            type="radio" name="landType"
            value="territory"
            checked={this.state.landType === 'territory'}
            onChange={this.landTypeChanged.bind(this)} /> territory
        </div>

        <div>
          Day: {this.dayCount}, Year: {this.yearCount}
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
