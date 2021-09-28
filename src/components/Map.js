import React from 'react'
import { envVars } from './envVars'

function Map( props ) {
    return (
        <div>
            {props.map.map((tile, key) => {
                if (key === props.playerX + envVars.WIDTH * props.playerY) {
                    return (<span key={key}> @ </span>)
                }
                else return (<span key={key}>{tile}</span>)
            })}
        </div>
    )
}

export default Map
