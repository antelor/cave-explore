import React from 'react'
import './Map.css'

interface MapProps {
    map: string[][];
    playerX: number,
    playerY: number
}

function Map( {map, playerX, playerY} : MapProps ) {
    return (
        <div className='Map'>
            {map.map((row:string[], keyRow:number) => {
                return row.map( (tile:any, index:number) => { 
                    if (tile==='@') {
                        return (<div key={index + '-' + keyRow} className="tile player">@</div>)
                    }
                    else return (<div key={index + '-' + keyRow} className="tile">{tile}</div>)              
                })
            }
            )}
        </div>
    )
}

export default Map
