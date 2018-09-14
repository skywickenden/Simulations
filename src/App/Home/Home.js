import React, { Component } from 'react';
import { Link } from 'react-router';
import ArrowWithPath from '../ArrowWithPath/ArrowWithPath'
// import './App.css';


export default class Home extends Component {
  render() {
    return (
      <nav>
        <ul className="App-intro">
          <li>
            <Link to="conincidence-of-wants">
              Conincidence Of Wants
            </Link>
          </li>

          <li>
            <Link to="daisy-world">
              Daisy World
            </Link>
          </li>

          <li>
            <Link to="society">
              Society
            </Link>
          </li>

          <li>
            <Link to="tribe">
              Tribe
            </Link>
          </li>

          <li>
            <Link to="people">
              People
            </Link>
          </li>

          <li>
            <ArrowWithPath
              className="boo"
              height={100}
              width={100}
              arrowDirection="N"
              arrowHeight={10}
              arrowWidth={10}
              arrowOffset={50}
              strokeWidth={5} />
          </li>
        </ul>
      </nav>
    );
  }
}
