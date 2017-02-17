import React, { Component } from 'react';
import { Link } from 'react-router';
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
        </ul>
      </nav>
    );
  }
}
