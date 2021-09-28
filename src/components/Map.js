import React from 'react'
import { envVars } from './envVars'
import './Map.css'

function Map( props ) {
    return (
        <div className='Map'>
            {props.map.map((tile, key) => {
                if (key === props.playerX + envVars.WIDTH * props.playerY) {
                    return (<div key={key}> @ </div>)
                }
                else return (<div key={key}>{tile}</div>)
            })}
        </div>
    )
}

export default Map
