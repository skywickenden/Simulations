import React, { Component } from 'react';
import { BrowserRouter, Match ,Miss, Link } from 'react-router';
// https://react-router.now.sh/quick-start

import CoincidenceOfWants from './CoincidenceOfWants/CoincidenceOfWants';
import DaisyWorld from './DaisyWorld/DaisyWorld';
import Society from './Society/Society';
import Home from './Home/Home';
import NotFound from './NotFound/NotFound';

import './App.css';


export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <h2>
              <Link to="/">Simulations</Link>
              </h2>
            <hr />
          </div>

          <Match exactly pattern="/conincidence-of-wants" component={CoincidenceOfWants} />
          <Match exactly pattern="/daisy-world" component={DaisyWorld} />
          <Match exactly pattern="/society" component={Society} />
          <Match exactly pattern="/" component={Home} />
          <Miss component={NotFound}/>

        </div>
      </BrowserRouter>
    );
  }
}
