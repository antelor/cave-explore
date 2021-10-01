import React, { Component } from 'react'
import { envVars } from './components/envVars'
import Map from './components/Map'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerX: 2,
      playerY: 2,
      mapArray:
        [ [] ]
    };

  }

  handleMovement = (event) => {
    let newState = this.state;
    let playerX = this.state.playerX;
    let playerY = this.state.playerY;
    
    switch (event.keyCode) {
      //left
      case 37:
        //si se puede caminar y no esta contra un borde, moverse
        if (newState.playerX % envVars.WIDTH !== 0 && this.state.mapArray[playerY][playerX - 1] !== '#') newState.playerX--;
        //si esta contra un borde, recrear mapa
        else if (newState.playerX === 0) {
          this.mapCreate();
          newState.playerX = envVars.WIDTH - 1;
        }
        break;
      
      //up
      case 38:
        //si se puede caminar y no esta contra un borde, moverse
        if( newState.playerY % envVars.HEIGHT !== 0  && this.state.mapArray[playerY-1][playerX]!=='#') newState.playerY--;
        //si esta contra un borde, recrear mapa
        else if (newState.playerY === 0) {
          this.mapCreate();
          newState.playerY = envVars.HEIGHT - 1;
        }
        break;
      
      //right
      case 39:
        //si se puede caminar y no esta contra un borde, moverse
        if( (newState.playerX + 1) % envVars.WIDTH !== 0  && this.state.mapArray[playerY][playerX+1] !== '#' ) newState.playerX++;
        //si esta contra un borde, recrear mapa
        else if (newState.playerX === envVars.WIDTH-1) {
          this.mapCreate();
          newState.playerX = 0;
        }
        break;
      
      //down
      case 40:
        //si se puede caminar y no esta contra un borde, moverse
        if( (newState.playerY + 1) % envVars.HEIGHT!== 0  && this.state.mapArray[playerY+1][playerX]!=='#' ) newState.playerY++;
        //si esta contra un borde, recrear mapa
        else if (newState.playerY === envVars.HEIGHT-1) {
          this.mapCreate();
          newState.playerY = 0;
        }
        break;
      
      default:
        break;
    }

    this.setState(newState);
  }

  //map handler
  mapCreate = () => {
    let newMap = [];
    //populate with random values
    for (let i = 0; i < envVars.HEIGHT; i++){
      let newRow = [];
      for (let j = 0; j < envVars.WIDTH; j++){
        let newTile = Math.floor(Math.random() * 100);
        console.log(newTile);
        if (newTile <= envVars.alivePerc) newTile = '#';
        if (newTile > envVars.alivePerc) newTile = '.';
  
        newRow.push(newTile);
      }
      newMap.push(newRow);
    }
    
    //conway
    for (let turns = 0; turns < 10; turns++){
      let conwayMap = this.conway(newMap);
      newMap = conwayMap;
    }
    
    //set new map in state
    let newState = this.state;
    newState.mapArray = newMap;
    this.setState(newState);
  }

  //contador de vecinos para conway
  checkNeighbors = (map, tileX, tileY) => {
    //indice actual = tileX + tileY * WIDTH

    let neighborCount = 0;
    /*
    1 2 3
    4 @ 5
    6 7 8
    */
    
    //4 & 5
    //left edge check
    if (tileX > 0) {
      if (map[tileY][tileX - 1] === '#') {
        neighborCount++;
        //console.log('4');
      }
    }
    //right edge check
    if ( tileX !== envVars.WIDTH-1) {
      if (map[tileY][tileX + 1] === '#') {
        neighborCount++;
        //console.log('5');
      }
    }

    //2 & 7
    //top edge check
    if (tileY > 0) {
      if (map[tileY - 1][tileX] === '#') {
        neighborCount++;
        //console.log('2');
      }
    }
    //bottom edge check
    if (tileY !== envVars.HEIGHT - 1) {
      if (map[tileY + 1][tileX] === '#') {
        neighborCount++;
        //console.log('7');
      }
    }

    //1 & 3
    if (tileY > 0 && tileX > 0) {
      if (map[tileY - 1][tileX - 1] === '#') {
        neighborCount++;
        //console.log('1');
      }
    }
    if (tileY > 0 && tileX !== envVars.WIDTH-1) {
      if (map[tileY - 1][tileX + 1] === '#') {
        neighborCount++;
        //console.log('3');
      }
    }

    //6 & 8
    if (tileY !== envVars.HEIGHT - 1 && tileX > 0) {
      if (map[tileY + 1][tileX - 1] === '#') {
        neighborCount++;
        //console.log('6');
      }
    }
    if (tileY < envVars.HEIGHT-1 && tileX !== envVars.WIDTH-1) {
      if (map[tileY + 1][tileX + 1] === '#') {
        neighborCount++;
        //console.log('8');
      }
    }
    
    return neighborCount;
  }

  conway = (map) => {
    let newMap = [];

    for (let y = 0; y < envVars.HEIGHT; y++) {
      let newRow = [];

      for (let x = 0; x < envVars.WIDTH; x++){
        //console.log(y + "y "+[x] + "x:");
        let neighbors = this.checkNeighbors(map, x, y);
        //let neighbors = 0;
        
        //B678/S345678 is the cellular automaton rule where a cell is born if it has 6,7,8 living neighbors,
        //and it survives if it has either 3 4 5 6 7 or 8 living neighbors, and dies otherwise

        //Any live cell with 3 4 5 6 7 or 8 live neighbours survives.
        if (map[y][x] === '#') {
          if (neighbors >=3 && neighbors <= 8) newRow.push('#');
          //All other live cells die in the next generation.
          else newRow.push('.');
        }

        //Any dead cell with 6,7,8 live neighbours becomes a live cell.
        if (map[y][x] === '.') {
          if (neighbors >=6 && neighbors <=8) newRow.push('#');
          //Similarly, all other dead cells stay dead.
          else newRow.push('.');          
        }
      }
      newMap.push(newRow);
    }
    return newMap;
  }


  componentDidMount() {
    document.addEventListener('keydown', this.handleMovement);
    this.mapCreate();
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
