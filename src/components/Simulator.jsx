import React, { Component } from 'react'
import styled from 'styled-components'
import sky from '../res/sky.jpg'
import constants from '../values/constants'
import Ship from '../values/ship';
import rocketImg from '../res/ship.svg'
import {useSpring, animated} from 'react-spring'
import earth from '../res/earth.png'
export default class Simulator extends Component {
    constructor(props){ 
        super(props)
        this.state={
            isRunning: false,
            tickrate: 30,
            isAccelerating: false,
            turningClockwise: false,
            turningCounterClockwise: false,
            windowX: 0,
            windowY: 0,
            planetX: 0,
            modConstant: .01 // used to fine tune acceleration and gravity ratios
        }
        // instantiate new ship object
        this.rocket = new Ship(constants.boosterAcceleration, constants.gravity, this.state.modConstant, this.state.windowX, this.state.windowY)
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

    // log ship object
    logShipObject = () =>{
        console.log(this.rocket)
    }

    // CONTROL
    
    
    isAccelerating = (e) => {
        if(this.state.accelerating){
            this.rocket.setAcceleration(this.state.isAccelerating)
        }  
    }

    // BEGIN SIMULATION //////////////////
    begin = () => {
        console.log('starting')
        this.runSimulation()}

    // SIMULATION LOOP
    runSimulation = () => {setInterval(this.simulation,1000/this.state.tickrate)} // run simulation method at 60hz

    // SIMULATION MODEL
    simulation = () => {
        this.forceUpdate()
        // handle turning
        if(this.state.turningClockwise){
            this.rocket.turnClockwise()
        }
        if(this.state.turningCounterClockwise){
            this.rocket.turnCounterClockwise()
        }
        this.rocket.gravityAccelerate(this.state.windowX, this.state.windowY)
        this.rocket.accelerate()
        this.rocket.moveShip()
    }


    // RENDERER //
    render() {
        let rocketPosition = {
            'left': `${this.rocket.x}px`,
            'bottom': `${this.rocket.y}px`,
            'transform': `rotate(${this.rocket.angle}deg)`
        }
        return (
            <SimulatorWrapper>
                <SimulatorWindow id="sim-window" style={{background:`url(${sky})`,backgroundSize:'cover', backgroundPosition:'center'}}>
                    {/* ship component */}
                    <Rocket style={rocketPosition}>
                        <img className="img-fluid" src={rocketImg} alt=""/>
                            {/* thrusters */}
                            {
                                this.state.turningClockwise &&
                                <div id="left-thruster-top" style={{position:'absolute', width:'8px',height:'2px', background:'linear-gradient(to left, white, rgba(255,255,255,.4))',top:'4px',left:'-8px' }}></div>

                            }
                            {
                                this.state.turningClockwise &&
                                <div id="right-thruster-bottom" style={{position:'absolute', width:'8px',height:'2px', background:'linear-gradient(to right, white, rgba(255,255,255,.4))',bottom:'4px',right:'-10px' }}></div>

                            }
                            {
                                this.state.turningCounterClockwise &&
                                <div id="right-thruster-top" style={{position:'absolute', width:'8px',height:'2px', background:'linear-gradient(to right, white, rgba(255,255,255,.4))',top:'4px',right:'-8px' }}></div>
                            }
                             {
                                this.state.turningCounterClockwise &&
                                <div id="left-thruster-bottom" style={{position:'absolute', width:'8px',height:'2px', background:'linear-gradient(to left, white, rgba(255,255,255,.4))',bottom:'4px',left:'-10px' }}></div>
                               
                            }

                            {/* engine plume */}
                            <div id="flames" style={{width:'10px', height:'20px', background:'red', position:'absolute ', bottom:'-20px',display: this.rocket.accelerating ? 'block' : 'none'}}>
                            </div>
                        
                    </Rocket>
                    <Info id="info" style={{'color': 'white'}}>
                        <p>Simulator Running: {this.state.isRunning.toString()}</p>
                        <p>Orientation: {this.rocket.angle}</p>
                        <p>Accelerating: {this.rocket.accelerating.toString()}</p>
                        <p>X: {this.rocket.x.toFixed(1)}, Y: {this.rocket.y.toFixed(1)}</p>
                        <p>VelX: {this.rocket.velX.toFixed(1)}, VelY: {this.rocket.velY.toFixed(1)}</p>
                        <p>GravityX: {this.rocket.gravityX.toFixed(1)}, GravityY: {this.rocket.gravityY.toFixed(1)}</p>
                    </Info>
                    <animated.div> 
                    <Planet style={{background:`url(${earth})`,backgroundPosition:'center', backgroundSize:'140%', overflow:'hidden'}} id="planet">
                        <div id="atmosphere-overlay" style={{opacity:.7,position:'absolute',top:0,bottom:0,left:0,right:0,background:`radial-gradient(circle at 25% 25%, rgba(255,255,255,.5) 0%,rgba(00,00,00,.8))`}}>

                        </div>
                        <Button onClick={this.begin.bind(this)}>START</Button>
                        <Button onClick={this.logShipObject.bind(this)}>Log</Button>

                        <Button onClick={this.resetSimulator.bind(this)}>RESET</Button>
                    </Planet>
                    </animated.div>
                    
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
    padding: 1rem;
    text-align: left;
    top: 0;
`
// planet
const Planet = styled.div`
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
    width: 10px;
    /* border-top: 2px solid red; */
    height: 20px;
    display:flex;
    justify-content:center;
    /* background: yellow; */
    position: absolute;
`

// control
const Button = styled.button`
    width: 80px;
    padding: 10px;
    box-sizing: border-box;
`