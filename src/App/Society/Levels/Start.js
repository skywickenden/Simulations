import React, { Component, PropTypes } from 'react';
import './Start.css';

export default class Start extends Component {
  static propTypes = {
    onLevelUp: PropTypes.func.isRequired,
  };

  state = {
    stage: 'start',
  };

  changeStage(newStage) {
    this.setState({stage: newStage});
  }

  render() {
    return (
      <div className="start">
        {this.state.stage === 'start' ? (
          <button onClick={this.changeStage.bind(this, 'genitals')}>Scratch your genitals</button>
        ) : ''}

        {this.state.stage === 'genitals' ? (
          <div>
            <p>
              It's not doing anything for you.
            </p>
            <button onClick={this.changeStage.bind(this, 'ponder')}>Ponder existance</button>
          </div>
        ) : ''}

        {this.state.stage === 'ponder' ? (
          <div>
            <p>
              You expereince a gnawing emptiness. It defines you entirely.
            </p>
            <button onClick={this.changeStage.bind(this, 'feel')}>Feel emptiness</button>
          </div>
        ) : ''}

        {this.state.stage === 'feel' ? (
          <div>
            <p>
              You feel driven to action. You must fill this emptiness... with something. Anything
            </p>
            <button onClick={this.changeStage.bind(this, 'eatHand')}>Eat</button>
          </div>
        ) : ''}

        {this.state.stage === 'eatHand' ? (
          <div>
            <p>
              You bite your hand.
            </p>
            <p>
              <strong>Ouch!</strong>
            </p>
            <p>
              That hurt. Must not eat self. Must eat something around me.
            </p>
            <button onClick={this.props.onLevelUp.bind(this)}>Eat something else</button>
          </div>
        ) : ''}

      </div>
    );
  }
}
