import React, { Component } from 'react';
import './Society.css';

import Start from './Levels/Start';
import OnePerson from './Levels/OnePerson';

export default class Society extends Component {

  state = {
    level: 0,
  };

  componentWillMount() {
    // this.world = new World(this.clockSpeed);
    // this.setState({activity: this.world.people[0].activity.name})
    // this.tickTock();
  }

  onLevelUp() {
    this.setState({level: this.state.level + 1});
  }

  render() {
    return (
      <div className="individual">
        <h4>Society</h4>

        {this.state.level === 0 ? (
          <Start onLevelUp={this.onLevelUp.bind(this)} />
        ) : ''}

        {this.state.level === 1 ? (
          <OnePerson onLevelUp={this.onLevelUp.bind(this)} />
        ) : ''}
      </div>
    );
  }
}
