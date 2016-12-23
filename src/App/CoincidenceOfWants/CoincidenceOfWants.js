import React, { Component } from 'react';
import './CoincidenceOfWants.css';

import MapRenderer from './MapRenderer';
import Population from './Population';
import Graph from './Graph';

export default class CoincidenceOfWants extends Component {

  state = {
    hoverX: null,
    hoverY: null,
    hoverContent: '',
    canvas: {
      width: 700,
      height: 400,
    },
    graph1: {
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
  graph1 = null;
  graph1Id = 'graph1';

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
    this.graph1 = new Graph(
      this.graph1Id,
      this.clockSpeed
    );
  }

  calculateCanvasSize() {
    const canvas = {};
    const containerPadding = 20;
    const padding = 10;
    const totalWidth = window.innerWidth - (2 * containerPadding);
    canvas.width = Math.floor(totalWidth * 0.7);
    canvas.width = Math.floor(canvas.width / this.state.populationRoot);
    canvas.width = canvas.width * this.state.populationRoot;
    canvas.height = Math.floor(window.innerHeight * 0.7);
    canvas.height = Math.floor(canvas.height / this.state.populationRoot);
    canvas.height = canvas.height * this.state.populationRoot;

    const graph1 = {};
    graph1.left = canvas.width + (2 * padding);
    graph1.width = totalWidth - graph1.left - containerPadding;
    graph1.height = (canvas.height / 2) - padding;

    this.setState({
      canvas,
      graph1,
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
            id="graph1"
            className="graph1"
            width={this.state.graph1.width}
            height={this.state.graph1.height}
            style={{
              left: this.state.graph1.left,
              width: this.state.graph1.width,
              height: this.state.graph1.height,
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
