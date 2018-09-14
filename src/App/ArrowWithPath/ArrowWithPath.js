import React, { Component, PropTypes } from 'react';
// import PropTypes from 'prop-types';

// https://codepen.io/knod/pen/YqLgwR

import './ArrowWithPath.css';

export default class ArrowWithPath extends Component {
  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    arrowDirection: PropTypes.string.isRequired,  // 'N', 'E', 'S', 'W'
    arrowWidth: PropTypes.number.isRequired,
    arrowHeight: PropTypes.number.isRequired,
    arrowOffset: PropTypes.number.isRequired, // from top left.
    strokeWidth: PropTypes.number.isRequired,
  };

  state = {
    arrowPath: '',
  };

  componentWillMount() {
    this.calculateArrow();
  }

  calculateArrow() {
    let path;
    console.log('#', this.props.arrowDirection);
    switch(this.props.arrowDirection) {
      case 'N':
        path = 'M ' + this.props.arrowOffset
          + ',' + this.props.strokeWidth
          + ' 95,' + (95 + (this.props.strokeWidth / 2))
          + ' 5,' + (95 + (this.props.strokeWidth / 2))
          + ' z';
        break;

      case 'E':
        break;

      case 'S':
        break;

      case 'W':
        break;

      default:
        console.error('Invalid arrow direction');
    }

    this.setState({arrowPath: path});
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={this.props.className + ' ArrowWithPath'}
        version="1.1"
        width={this.props.width}
        height={this.props.height} >
        <path
          d={this.state.arrowPath}
          style={{
            strokeWidth: this.props.strokeWidth,
            stroke: 'red',
          }}/>
      </svg>
    );
  }
}
