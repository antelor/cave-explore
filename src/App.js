import React, { Component } from 'react'
import Map from './components/Map'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerX : 1,
      playerY : 0,
      mapArray :
      ['#', '#', '#', '#',
       '#', '.', '.', '#',
       '#', '.', '.', '#',
       '#', '.', '.', '#',
       '#', '#', '#', '#']      
    }
  }


  render() {
    return(
      <div>
        <Map map={this.state.mapArray} playerX={this.state.playerX} playerY={this.state.playerY}/>
      </div>
    )
  
  }
      
}

export default App;
