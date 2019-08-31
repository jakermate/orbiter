import React, { Component } from 'react'
import styled from 'styled-components'

import constants from '../values/constants'
import Ship from '../values/ship';

export default class Simulator extends Component {
    constructor(props){
        super(props)
        this.state={
            tickrate: 60
        }
        // instantiate new ship object
        var rocket = new Ship()
    }
    
    findVelVector = (rocketAngle) => {

    }

    // begin simulation
    begin = () => {
        console.log('starting')
        this.runSimulation()}

    // simulation loop
    runSimulation = () => {setInterval(this.simulation,1000/this.state.tickrate)} // run simulation method at 60hz

    // simulation model
    simulation = () => {
        console.log('running...')
    }

    render() {
        return (
            <SimulatorWrapper>
                <SimulatorWindow>
                    <Planet>
                        <button onClick={this.begin.bind(this)}>START</button>
                    </Planet>
                </SimulatorWindow>
            </SimulatorWrapper>
        )
    }
}

// styles
const SimulatorWrapper = styled.div`
    width: 100%;
    min-height: 800px;
`
const SimulatorWindow = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: black;
    padding: 50px;
`
const Planet = styled.div`
    background-color: white;
    margin-top: 100px;
    width: 300px;
    height: 300px;
    border-radius: 100%;

`
