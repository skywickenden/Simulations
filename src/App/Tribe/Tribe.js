import React, { Component } from 'react';

import P5Wrapper from '../../libraries/P5Wrapper';
import sketch from './sketch';

import './Tribe.css';

export default class Tribe extends Component {

  state = {
    rotation: 0,
  };

  componentDidMount() {
  }

  onTestClick() {
    this.setState({rotation: this.state.rotation + 1});
  }

  render() {

    return (
      <div className="tribe">
        <h4>Tribe</h4>

        <P5Wrapper sketch={sketch} rotation={this.state.rotation}/>

        <button onClick={this.onTestClick.bind(this)}>Rotate</button>

      </div>
    );
  }
}
