import React, { Component } from 'react'
import styled from 'styled-components'

import constants from '../values/constants'
import Ship from '../values/ship';

export default class Simulator extends Component {
    constructor(props){
        super(props)
        this.state={
            tickrate: 60,
            isAccelerating: false,
            turningClockwise: false,
            turningCounterClockwise: false
        }
        // instantiate new ship object
        this.rocket = new Ship()
    }
    
    // setup of input
    componentDidMount(){
        // disable spacebar scroll
        // window.onkeydown = function(e) { 
        //     return !(e.keyCode === 32);
        // };
        // keydown to set acceleration to true
        document.addEventListener('keydown', (e)=>{
            e.preventDefault()
            if(e.keyCode === 32){
                this.setState({isAccelerating: true}, ()=>
                console.log('Accelerating'))
            }
            // start turning clockwise
            if(e.keyCode === 68){
                this.setState({turningClockwise: true}, ()=>
                console.log("Turning clockwise..."))
            }
            // start turning counterclockwise
            if(e.keyCode === 65){
                this.setState({turningCounterClockwise: true}, ()=>
                console.log("Turning counterclockwise..."))
            }
        })

        // keyup to set acceleration to false
        document.addEventListener('keyup', (e)=>{
            e.preventDefault()
            if(e.keyCode === 32){
                this.setState({isAccelerating: false}, ()=>
                console.log('Stopped accelerating'))
            }
            // stop turning clockwise
            if(e.keyCode === 68){
                this.setState({turningClockwise: false}, ()=>
                console.log("Stopped turning clockwise..."))
            }
            // stop turning counterclockwise
            if(e.keyCode === 65){
                this.setState({turningCounterClockwise: false}, ()=>
                console.log("Stopped turning counterclockwise..."))
            }
        })
        


    }

    // control
    
    setAccelerationState = () => {
        this.setState({isAccelerating: true},
            this.isAccelerating() // change rocket object acceleration property to reflect state
            )
    }
    isAccelerating = (e) => {
        if(this.state.accelerating){
            this.rocket.setAcceleration(this.state.isAccelerating)
        }  
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
        // handle turning
        if(this.state.turningClockwise){
            this.rocket.turnClockwise()
        }
        if(this.state.turningCounterClockwise){
            this.rocket.turnCounterClockwise()
        }

    }

    render() {
        return (
            <SimulatorWrapper>
                <SimulatorWindow>
                    <div id="info" style={{'color': 'white'}}>
                        {this.rocket.angle}
                    </div>
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
