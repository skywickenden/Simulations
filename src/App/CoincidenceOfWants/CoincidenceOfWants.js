import React, { Component } from 'react';
import './CoincidenceOfWants.css';

import MapRenderer from './MapRenderer';
import Population from './Population';

export default class CoincidenceOfWants extends Component {

  state = {
    hoverX: null,
    hoverY: null,
    hoverContent: '',
  };

  Renderer = null;
  canvasId = 'canvas';
  Population = null;
  clockSpeed = 500;

  componentDidMount() {
    const populationRoot = 31;
    this.Population = new Population(populationRoot, this.clockSpeed);
    this.Renderer = new MapRenderer(
      this.canvasId,
      this.Population,
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
    this.Renderer.setHover(hoverX, hoverY);
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
    if (this.Renderer
      && this.Renderer.displayHover
      && this.state.hoverX !== null
    ) {
      hoverContent = this.state.hoverContent;
    }

    const hoverStyle = {
      left: this.state.hoverX,
      top: this.state.hoverY,
      display: hoverContent.length !== 0 ? 'block' : 'none',
    };

    return (
      <div className="CoincidenceOfWants">
        <h4>Coincidence Of Wants</h4>

        <div className="canvasContainer">
          <div className="canvasHover" style={hoverStyle}>
            {hoverContent}
          </div>
          <canvas
            id="canvas"
            width="1000"
            height="600"
            ref="canvas"
            onMouseOut={this.onCanvasOut.bind(this)}
            onMouseMove={this.onCanvasHover.bind(this)}
            />
        </div>

      </div>
    );
  }
}
