import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { envVars } from './components/envVars';
import Map from './components/Map';
import './App.css';

function App(this: any) {
  const [playerX, _setPlayerX] = useState(4);
  const [playerY, _setPlayerY] = useState(4);
  const [mapArray, _setMapArray] = useState(firstMapCreate());

  //setting the refs to handle movement using latest state
  //https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
  const mapArrayRef = React.useRef(mapArray);
  function setMapArray (data: Array<string[]>){
    mapArrayRef.current = data;
    _setMapArray(data);
  };

  const playerYRef = React.useRef(playerY);
  function setPlayerY (data: number){
    playerYRef.current = data;
    _setPlayerY(data);
  };

  const playerXRef = React.useRef(playerX);
  function setPlayerX (data: number){
    playerXRef.current = data;
    _setPlayerX(data);
  };
  
  function handleMovement(event: any){    
    let newPlayerX = playerXRef.current;
    let newPlayerY = playerYRef.current;
    let newMap = mapArrayRef.current;

    console.log(newPlayerX + ' ' + newPlayerY)
    
    switch (event.keyCode) {
      //left
      case 37:
        //if against map border, recreate map
        if (newPlayerX === 0) {
          newMap = mapCreate();
          newPlayerX = envVars.WIDTH-1;
          break;
        }
        //if walkable and not againt wall move
        if (newMap[newPlayerY][newPlayerX - 1] !== '#') newPlayerX--;
        break;
      
      //up
      case 38:
        //if against map border, recreate map
        if (newPlayerY === 0) {
          newMap = mapCreate();
          newPlayerY = envVars.HEIGHT-1;
          break;
        }
        //if walkable and not againt wall move
        if(newMap[newPlayerY-1][newPlayerX]!=='#') newPlayerY--;
        break;
      
      //right
      case 39:
        //if against map border, recreate map
        if (newPlayerX === envVars.WIDTH-1) {
          newMap = mapCreate();
          newPlayerX = 0;
          break;
        }
        //if walkable and not againt wall move
        if(newMap[newPlayerY][newPlayerX+1] !== '#') newPlayerX++;
        break;
      
      //down
      case 40:
        //if against map border, recreate map
        if (newPlayerY === envVars.HEIGHT-1) {
          newMap = mapCreate();
          newPlayerY = 0;
          break;
        }
        //if walkable and not againt wall move
        if(newMap[newPlayerY+1][newPlayerX]!=='#' ) newPlayerY++;
        break;
      
      default:
        break;
    }
    
    newMap[playerYRef.current][playerXRef.current]='.';
    newMap[newPlayerY][newPlayerX]='@';
    
    setPlayerX(newPlayerX);
    setPlayerY(newPlayerY);
    setMapArray(newMap);
  }

  function firstMapCreate(){
    let newMap = mapCreate();

    //making whichever tile the player is on a floor tile
    newMap[playerY][playerX] = '@';

    return newMap;
  }

  //map handler
  function mapCreate(){
    let newMap = [];
    //populate with random values
    for (let i = 0; i < envVars.HEIGHT; i++){
      let newRow = [];
      for (let j = 0; j < envVars.WIDTH; j++){
        let newTile = '';
        let rand = Math.floor(Math.random() * 100);
        if (rand <= envVars.alivePerc) newTile = '#';
        if (rand > envVars.alivePerc) newTile = '.';
  
        newRow.push(newTile);
      }
      newMap.push(newRow);
    }
    
    //conway
    for (let turns = 0; turns < 10; turns++){
      let conwayMap = conway(newMap);
      newMap = conwayMap;
    }
    
    return newMap;
  }

  //contador de vecinos para conway
  function checkNeighbors(map: string[][], tileX: number, tileY: number){
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

  function conway(map: string[][]){
    let newMap = [];

    for (let y = 0; y < envVars.HEIGHT; y++) {
      let newRow = [];

      for (let x = 0; x < envVars.WIDTH; x++){
        //console.log(y + "y "+[x] + "x:");
        let neighbors = checkNeighbors(map, x, y);
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

  useEffect(()=>{
    window.addEventListener('keydown', handleMovement);
  }, []);

  return( 
    <div className="App">
      <Map map={mapArray} playerX={playerX} playerY={playerY} />
    </div>
  )
      
}

export default App;
