import React, { Component } from 'react';
import { render } from 'react-dom';
import '../css/styles.css';
import PlanetList from './components/PlanetList';

class App extends Component {
  render() {
    return (
      <div className="container">
          <h1 className="Title">Planet Supervisor</h1>
          <h2 className="">Disover, create and destroy planets in the Star Wars universe!</h2>
          <PlanetList />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
