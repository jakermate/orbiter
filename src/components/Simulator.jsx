import React, { Component } from 'react'
import styled from 'styled-components'

import constants from '../values/constants'
import Ship from '../values/ship';

export default class Simulator extends Component {
    constructor(props){
        super(props)
        this.state={
            isRunning: false,
            tickrate: 60,
            isAccelerating: false,
            turningClockwise: false,
            turningCounterClockwise: false,
            windowX: 0,
            windowY: 0,
            planetX: 0,
            constant: 1 // used to fine tune acceleration and gravity ratios
        }
        // instantiate new ship object
        this.rocket = new Ship(constants.boosterAcceleration, constants.gravity)
    }
    
    getSimDimensions(){
        // find simulator window dimensions
        let simWindow = document.getElementById('sim-window')
        let winX = simWindow.scrollWidth
        let winY = simWindow.scrollHeight
        this.setState({windowX: winX, windowY: winY}, ()=>console.log(`x: ${this.state.windowX}\ny: ${this.state.windowY}`))
        // find planet radius
        let planetDiv = document.getElementById('planet')
        let planetRadius = planetDiv.scrollWidth / 2
        this.setState({planetX: planetRadius},()=>console.log(`Planet radius: ${this.state.planetX}`))
    }


    // setup of input
    componentDidMount(){
        //  initial simulator window sizes
        this.getSimDimensions()


        // resize listener
        window.addEventListener('resize',()=>this.resetSimulator())

        // key listeners
        document.addEventListener('keydown', (e)=>{
            e.preventDefault()
            if(e.keyCode === 32){
                // on first engine fire, start simulation
                if(!this.state.isRunning){
                    this.begin()
                    this.setState({isRunning: true})
                }
                this.setState({isAccelerating: true}, ()=>
                console.log('Accelerating'))
                this.rocket.setAcceleration(true)
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
                this.rocket.setAcceleration(false)
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

    resetSimulator = () => {
        this.getSimDimensions()
        // set ship starting point
        this.rocket.resetShip(this.state.windowX, this.state.windowY, this.state.planetX)
        this.forceUpdate()
    }

    // control
    
    
    isAccelerating = (e) => {
        if(this.state.accelerating){
            this.rocket.setAcceleration(this.state.isAccelerating)
        }  
    }

    // begin simulation //////////////////
    begin = () => {
        console.log('starting')
        this.runSimulation()}

    // simulation loop
    runSimulation = () => {setInterval(this.simulation,1000/this.state.tickrate)} // run simulation method at 60hz

    // simulation model
    simulation = () => {
        this.forceUpdate()
        console.log('running...')
        // handle turning
        if(this.state.turningClockwise){
            this.rocket.turnClockwise()
        }
        if(this.state.turningCounterClockwise){
            this.rocket.turnCounterClockwise()
        }
        this.rocket.accelerate()
        this.rocket.moveShip()
    }

    render() {
        let rocketPosition = {
            'left': `${this.rocket.x}px`,
            'top': `${this.rocket.y}px`
        }
        return (
            <SimulatorWrapper>
                <SimulatorWindow id="sim-window">
                    {/* ship component */}
                    <Rocket style={rocketPosition}>

                    </Rocket>
                    <Info id="info" style={{'color': 'white'}}>
                        <p>Simulator Running: {this.state.isRunning.toString()}</p>
                        <p>Orientation: {this.rocket.angle}</p>
                        <p>Accelerating: {this.rocket.accelerating.toString()}</p>
                        <p>X: {this.rocket.x}, Y: {this.rocket.y}</p>
                        <p>VelX: {this.rocket.velX}, VelY: {this.rocket.velY}</p>
                    </Info>
                    <Planet id="planet">
                        <button onClick={this.begin.bind(this)}>START</button>
                        <button onClick={this.resetSimulator.bind(this)}>RESET</button>
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
    position: relative;
`
const SimulatorWindow = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    min-height: 80vh;
    overflow: visible;
    background-color: black;
    padding: 50px;
    position: relative;
`
const Info = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
`
// planet
const Planet = styled.div`
    background: linear-gradient(-45deg, rgba(255,255,255,1),rgba(200,200,200,.8));
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 300px;
    position: relative;
    border-radius: 100%;

`
// ship
const Rocket = styled.div`
    width: 5px;
    height: 5px;
    background-color: white;
    position: absolute;
`
