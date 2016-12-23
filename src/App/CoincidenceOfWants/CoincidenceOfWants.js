import React, { Component } from 'react';
import './CoincidenceOfWants.css';

import MapRenderer from './MapRenderer';
import Population from './Population';
import EqualityGraph from './EqualityGraph';

export default class CoincidenceOfWants extends Component {

  state = {
    hoverX: null,
    hoverY: null,
    hoverContent: '',
    canvas: {
      width: 700,
      height: 400,
    },
    equalityGraph: {
      left: 710,
      width: 100,
      height: 100,
    },
    populationRoot: 31,
  };

  renderer = null;
  canvasId = 'canvas';
  population = null;
  clockSpeed = 100;
  equalityGraph = null;
  equalityGraphId = 'equalityGraph';

  componentWillMount() {
    this.calculateCanvasSize();
  }

  componentDidMount() {
    this.population = new Population(this.state.populationRoot, this.clockSpeed);
    this.renderer = new MapRenderer(
      this.canvasId,
      this.population,
      this.clockSpeed,
      this.setHoverContent.bind(this)
    );
    this.equalityGraph = new EqualityGraph(
      this.equalityGraphId,
      this.clockSpeed,
      this.population
    );
  }

  calculateCanvasSize() {
    const canvas = {};
    const containerPadding = 20;
    const padding = 10;
    const totalWidth = window.innerWidth - (2 * containerPadding);
    canvas.width = Math.floor(totalWidth * 0.7);
    canvas.width = Math.floor(canvas.width / this.state.populationRoot);
    canvas.width *= this.state.populationRoot;
    canvas.height = Math.floor(window.innerHeight * 0.7);
    canvas.height = Math.floor(canvas.height / this.state.populationRoot);
    canvas.height *= this.state.populationRoot;

    const equalityGraph = {};
    equalityGraph.left = canvas.width + (2 * padding);
    equalityGraph.width = totalWidth - equalityGraph.left - containerPadding;
    equalityGraph.height = (canvas.height / 2) - padding;

    this.setState({
      canvas,
      equalityGraph,
    });
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

    const totalDead = this.population === null ? 0 : this.population.totalDead;
    const itteration = this.population === null ? 0 : this.population.itteration;

    return (
      <div className="CoincidenceOfWants">
        <h4>Coincidence Of Wants</h4>

        <div className="canvasContainer">
          <div className="canvasHover" style={hoverStyle}>
            {hoverContent}
          </div>
          <canvas
            id="equalityGraph"
            className="equalityGraph"
            width={this.state.equalityGraph.width}
            height={this.state.equalityGraph.height}
            style={{
              left: this.state.equalityGraph.left,
              width: this.state.equalityGraph.width,
              height: this.state.equalityGraph.height,
            }}
            />
          <canvas
            id="canvas"
            width={this.state.canvas.width}
            height={this.state.canvas.height}
            ref="canvas"
            onMouseOut={this.onCanvasOut.bind(this)}
            onMouseMove={this.onCanvasHover.bind(this)}
            />
        </div>
        <div className="stats">
          <div>
            Tick Tock: {itteration}
          </div>
          <div>
            Total Dead: {totalDead}
          </div>
        </div>

        <p>
          First show no trading.
          First show coincidence of wants.
          Next show trading with fixed money supply. Initially there is much more sharing going on.
          But it slows down and dies off. Why
          ... tried selling excess stock as well as buying when needed. no joy. it still dies off
          ... next make money a resource that is harvested to make up for the concentration of wealth.
        </p>

      </div>
    );
  }
}
