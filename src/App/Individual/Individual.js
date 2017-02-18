import React, { Component } from 'react';
import './Individual.css';

import World from './World';

export default class Individual extends Component {

  clockSpeed = 10;
  clockModifier = 10; // Update the display at a slower pace than the main clock.

  world = null;
  individual = null;

  state = {
    energyQuantity: 0,
    activity: '',
    emotion: '',
  };

  componentWillMount() {
    this.world = new World(this.clockSpeed);
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
      </div>
    );
  }
}
