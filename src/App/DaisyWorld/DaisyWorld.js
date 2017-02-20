import React, { Component } from 'react';
import './DaisyWorld.css';

import MapRenderer from './MapRenderer';
import Daisies from './Daisies';

export default class DaisyWorld extends Component {

  state = {
    hoverX: null,
    hoverY: null,
  };

  renderer = null;
  canvasId = 'daisyWorld';
  daisies = null;
  clockSpeed = 10;
  populationRoot = 50;

  componentDidMount() {
    this.daisies = new Daisies(this.populationRoot, this.clockSpeed);
    this.renderer = new MapRenderer(
      this.canvasId,
      this.daisies,
      this.clockSpeed,
      this.setHoverContent.bind(this)
    );
  }

  onCanvasHover(event) {
    const boundingRect = this.refs.canvas.getBoundingClientRect();
    const offsetTop = parseInt(boundingRect.top, 10);
    const offsetLeft = parseInt(boundingRect.left, 10);
    const additionalOffset = 30;
    const hoverX = event.clientX - offsetLeft;
    const hoverY = event.clientY - offsetTop;
    this.setState({
      hoverX: hoverX + additionalOffset,
      hoverY: hoverY + additionalOffset,
    });
    this.renderer.setHover(hoverX, hoverY);
  }

  setHoverContent(content) {
    this.setState({
      hoverContent: content,
    });
  }

  onCanvasOut(event) {
    this.setState({
      hoverX: null,
      hoverY: null,
    });
  }

  render() {

    let hoverContent = [];
    if (this.renderer
      && this.renderer.displayHover
      && this.state.hoverX !== null
    ) {
      hoverContent = this.state.hoverContent;
    }

    const hoverStyle = {
      left: this.state.hoverX,
      top: this.state.hoverY,
      display: hoverContent.length !== 0 ? 'block' : 'none',
    };

    // const totalDead = this.Population === null ? 0 : this.Population.totalDead;
    // const itteration = this.Population === null ? 0 : this.Population.itteration;

    return (
      <div className="Daisy World">
        <h4>Daisy World</h4>

        <div className="canvasContainer">
          <div className="canvasHover" style={hoverStyle}>
            {hoverContent}
          </div>

          <canvas
            id="daisyWorld"
            width="600"
            height="600"
            ref="canvas"
            onMouseOut={this.onCanvasOut.bind(this)}
            onMouseMove={this.onCanvasHover.bind(this)}
            />

          <canvas
            id="earthTemperature"
            width="50"
            height="600"
            ref="earthCanvas" />

          <canvas
            id="sunTemperature"
            width="50"
            height="600"
            ref="sunCanvas" />
        </div>
        <div className="stats">
        </div>

        <p>
        </p>

      </div>
    );
  }
}
