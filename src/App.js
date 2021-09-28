import React, { Component } from 'react'
import { envVars } from './components/envVars'
import Map from './components/Map'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerX: 1,
      playerY: 1,
      mapArray:
        ['#', '#', '#', '#',
          '#', '.', '.', '#',
          '#', '.', '.', '#',
          '#', '.', '.', '#',
          '#', '#', '#', '#']
    };

  }

  handleMovement = (event) => {
    let newState = this.state;
    switch (event.keyCode) {
      //left
      case 37:
        if( newState.playerX % envVars.WIDTH != 0 ) newState.playerX--;
        break;
      
      //up
      case 38:
        if( newState.playerY % envVars.HEIGHT != 0 ) newState.playerY--;
        break;
      
      //right
      case 39:
        if( (newState.playerX + 1) % envVars.WIDTH != 0 ) newState.playerX++;
        break;
      
      //down
      case 40:
        if( (newState.playerY + 1) % envVars.HEIGHT!= 0 ) newState.playerY++;
        break;
    }

    this.setState(newState);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleMovement);
  }

  render() {
    return(
      <div>
        <Map map={this.state.mapArray} playerX={this.state.playerX} playerY={this.state.playerY} />
      </div>
    )
  
  }
      
}

export default App;
