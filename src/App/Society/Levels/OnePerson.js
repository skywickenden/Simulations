import React, { Component } from 'react';
import './OnePerson.css';

import World from '../World/World';

export default class OnePerson extends Component {

  clockSpeed = 10;
  clockModifier = 10; // Update the display at a slower pace than the main clock.
  initialPersonEnergy = 300;

  world = null;
  individual = null;

  state = {
    energyQuantity: 0,
    activity: '',
    emotion: '',
  };

  componentWillMount() {
    this.world = new World(this.clockSpeed, this.initialPersonEnergy);
    this.setState({activity: this.world.people[0].activity.name})
    this.tickTock();
  }

  tickTock() {
    setTimeout(() => {
      if(this.world.people[0]) {
        this.setState({
          energyQuantity: parseInt(this.world.people[0].needs.energy.quantity, 10),
          emotion: this.world.people[0].emotion.name,
          activity: this.world.people[0].activity.name,
        });
      } else {
        this.setState({activity: 'Dead'});
      }
      this.tickTock();
    }, this.clockSpeed * this.clockModifier);
  }

  onEatSomething() {
    if(this.world.people[0]) {
      this.world.people[0].activity.engageActivity('eatEnvironment');
    }
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

        <div>
          <button onClick={this.onEatSomething.bind(this)}>Eat something</button>
        </div>
      </div>
    );
  }
}
