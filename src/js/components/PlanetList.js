import React, { Component } from 'react';

import Planet from './Planet'

class PlanetList extends Component {
  constructor() {
    super();
    this.state = {
      searchedTerm: '',
      planets: []
    }
  }

  componentDidMount() {
    fetch('/api/planets').then(result => {
      return result.json();
    }).then(data => {
      this.setState({
        planets: data
      });
    });
  };

  handleSearch(e) {
    e.preventDefault();
    this.setState({searchedTerm: e.target.value.toLowerCase()});
  }

  handleAddPlanet(e) {
    e.preventDefault();
    const planet = e.target.name.value;
    const planetId = e.target.parentNode.id;
    fetch('/api/planets', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "name": planet
        })
      }).then(response => {
        return response.json();
      }).then(data => {
    });
    this.forceUpdate()
  };

  render () {
    let planets;

    if (this.state.searchedTerm) {
      planets = this.state.planets.filter(planet => { return planet.name.toLowerCase().indexOf(this.state.searchedTerm) > -1})
    } else {
      planets = this.state.planets;
    };

    planets = planets.map(planet => {
      return <Planet
                key={planet._id}
                id={planet._id}
                name={planet.name}
                comments={planet.comments}
              />
            });

    return (
      <div className="planet-list">
        <div className='search'>
          <input type='text' name="name" placeholder="Find Planet" onChange={e => this.handleSearch(e)} required/>
        </div>
        <ul>{planets}</ul>
        <hr/>
        <form onSubmit={e => this.handleAddPlanet(e)}>
          <input type='text' name="name" placeholder="Add planet" />
        </form>
      </div>
     )
  }
}

export default PlanetList;
