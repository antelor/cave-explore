import React from 'react'
import './Map.css'

function Map( props ) {
    return (
        <div className='Map'>
            {props.map.map((row, keyRow) => {
                return row.map( (tile, index) => { 
                    if (keyRow === props.playerY && index === props.playerX) {
                        return (<div key={index + '-' + keyRow} className="tile player"> @ </div>)
                    }
                    else return (<div key={index + '-' + keyRow} className="tile">{tile}</div>)              
                })
            }
            )}
        </div>
    )
}

export default Map
