import React, { Component } from 'react';
import './OnePerson.css';

import World from '../World/World';

export default class OnePerson extends Component {

  clockSpeed = 10;
  clockModifier = 10; // Update the display at a slower pace than the main clock.
  initialPersonEnergy = 300;

  world = null;
  person = null;

  subLevel = 1;

  state = {
    energyQuantity: 0,
    activity: '',
    emotion: '',
  };

  componentWillMount() {
    console.log('componentWillMount');
    this.world = new World(this.clockSpeed, this.initialPersonEnergy, 1);
    this.person = this.world.people[0];
    this.setState({activity: this.person.activity.name})
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      if(this.person) {
        this.setState({
          energyQuantity: parseInt(this.person.needs.energy.quantity, 10),
          emotion: this.person.emotion.name,
          activity: this.person.activity.name,
        });
      } else {
        this.setState({activity: 'Dead'});
      }
      this.tickTock();
    }, this.clockSpeed * this.clockModifier);
  }

  eatSomethingClicked() {
    if(this.person) {
      this.person.activity.engageActivity('eatEnvironment');
    }
  }

  tryAgainClicked() {
    if (this.subLevel === 1) this.world.experience.forage.levelUp();
    // this.subLevel++;
    this.person.rebirth();
  }

  render() {
    return (
      <div className="individual">
        <h4>Individual</h4>

        <div>
          Emotion: {this.state.emotion}
        </div>

        <div>
          Activity: {this.state.activity}
        </div>

        <div>
          Energy: {this.state.energyQuantity}
        </div>
        <div>Message Log:</div>
        <div>
          {this.world.messageLog.map((row, index) => {
            console.log(row.colour);
            return (
              <p key={index} style={{color: row.colour}}>{row.text}</p>
            );
          })}
        </div>
        {this.person.alive ? (
          <div>
            <button onClick={this.eatSomethingClicked.bind(this)}>Eat Something</button>
          </div>
        ) : (
          <div>
            You are Dead.
            {this.sublevel === 1 ? (
              <p>Perhaps you should try eating something that is alive?</p>
            ) : ''}
            <button onClick={this.tryAgainClicked.bind(this)}>Try Again</button>
          </div>
        )}
      </div>
    );
  }
}
