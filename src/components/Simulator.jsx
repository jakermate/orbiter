import React, { Component } from 'react'
import styled from 'styled-components'
import sky from '../res/sky.jpg'
import constants from '../values/constants'
import Ship from '../values/ship';
import rocketImg from '../res/ship.svg'
import { useSpring, animated } from 'react-spring'
import explosionSpritesheet from '../res/explosion.png'
import earth from '../res/earth.png'
const clipPath = {
    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
}
export default class Simulator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRunning: false,
            tickrate: 30,
            isAccelerating: false,
            turningClockwise: false,
            turningCounterClockwise: false,
            windowX: 0,
            thrust: 60,
            windowY: 0,
            planetaryMass: 5.9722,
            planetX: 150,
            grade: 0,
            controlsActive: true,
            computationsActive: true,
            modConstant: .01 // used to fine tune acceleration and gravity ratios
        }
        // instantiate new ship object
        this.rocket = new Ship(constants.boosterAcceleration, constants.gravity, this.state.modConstant, this.state.windowX, this.state.windowY, this.state.planetX)
    }
    interval
    updatePlanetMass(event) {
        this.setState(event.target.value, function () {
            // update planetMass in ship object
            this.rocket.planetMass = this.state.planetaryMass
        })
    }
    getSimDimensions() {
        // find simulator window dimensions
        let simWindow = document.getElementById('sim-window')
        let winX = simWindow.scrollWidth
        let winY = simWindow.clientHeight
        this.setState({ windowX: winX, windowY: winY }, () => console.log(`x: ${this.state.windowX}\ny: ${this.state.windowY}`))
        // find planet radius
        let planetDiv = document.getElementById('planet')
        let planetRadius = planetDiv.scrollWidth / 2
        this.setState({ planetX: planetRadius }, function () {
            console.log(`Planet radius: ${this.state.planetX}`)
            this.rocket.resetShip(winX, winY, this.state.planetX)
            this.forceUpdate()
        })
    }
    // setup of input
    componentDidMount() {
        //  initial simulator window sizes
        this.getSimDimensions()

        // resize listener
        window.addEventListener('resize', () => this.resetSimulator())

        // key listeners
        document.addEventListener('keydown', (e) => {
            e.preventDefault()
            if (e.keyCode === 32) {
                // on first engine fire, start simulation
                if (!this.state.isRunning) {
                    this.begin()
                    this.setState({ isRunning: true })
                }
                this.setState({ isAccelerating: true }, () =>
                    console.log('Accelerating'))
                this.rocket.setAcceleration(true)
            }
            // start turning clockwise
            if (e.keyCode === 68) {
                this.setState({ turningClockwise: true })
            }
            // start turning counterclockwise
            if (e.keyCode === 65) {
                this.setState({ turningCounterClockwise: true })
            }
        })

        // keyup to set acceleration to false
        document.addEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.keyCode === 32) {
                this.setState({ isAccelerating: false }, () =>
                    console.log('Stopped accelerating'))
                this.rocket.setAcceleration(false)
            }
            // stop turning clockwise
            if (e.keyCode === 68) {
                this.setState({ turningClockwise: false }, () =>
                    console.log("Stopped turning clockwise..."))
            }
            // stop turning counterclockwise
            if (e.keyCode === 65) {
                this.setState({ turningCounterClockwise: false }, () =>
                    console.log("Stopped turning counterclockwise..."))
            }
        })



    }

    resetSimulator = () => {
        this.getSimDimensions()
        this.setState({ isRunning: false })
        // set ship starting point
        this.rocket.resetShip(this.state.windowX, this.state.windowY, this.state.planetX, this.interval)
        this.forceUpdate()
    }
    revertDefaultSettings() {

    }
    // log ship object
    logShipObject = () => {
        console.log(this.rocket)
    }

    // CONTROL
    toggleControls() {
        this.setState({ controlsActive: !this.state.controlsActive })
    }
    toggleComputations() {
        this.setState({ computationsActive: !this.state.computationsActive })
    }
    updateThrust(e) {
        console.log(e.target.value)
        this.setState({ thrust: e.target.value }, () => {
            this.rocket.set_thrust(this.state.thrust)
            console.log(this.state.thrust)
        })
    }
    updatePlanetaryMass(e) {
        this.setState({ planetaryMass: e.target.value }, () => {
            this.rocket.set_planetMass(this.state.planetaryMass)
            console.log(this.rocket.planetMass)
        })
    }

    isAccelerating = (e) => {
        if (this.state.accelerating) {
            this.rocket.setAcceleration(this.state.isAccelerating)
        }
    }

    // BEGIN SIMULATION //////////////////
    begin = () => {
        console.log('starting')
        this.runSimulation()
    }

    // SIMULATION LOOP
    runSimulation = () => {
        this.interval = setInterval(this.simulation, 1000 / this.state.tickrate)
    } // run simulation method at 60hz

    // SIMULATION MODEL
    simulation = () => {
        this.forceUpdate()
        // handle turning
        if (this.state.turningClockwise) {
            this.rocket.turnClockwise()
        }
        if (this.state.turningCounterClockwise) {
            this.rocket.turnCounterClockwise()
        }
        this.rocket.gravityAccelerate(this.state.windowX, this.state.windowY)
        this.rocket.accelerate()
        this.rocket.moveShip()
        let didCollide = this.rocket.detectCollision()
        if(didCollide){
            this.createExplosion()
            this.resetSimulator()
        }
    }

    createExplosion(){
       let explosion = document.createElement('div')
       explosion.id = 'explosion'
       explosion.style.width = '256px'
       explosion.style.height = '256px'
       explosion.style.background = `url(${explosionSpritesheet})`
       explosion.style.backgroundPosition = `0px 0px`
       explosion.style.position = 'absolute'
       explosion.style.left = `${this.rocket.x - 128}px`
       explosion.style.bottom = `${this.rocket.y - 128}px`
       explosion.style.zIndex = 999
       document.getElementById('sim-window').appendChild(explosion)
       let countX = 0
       let countY = 0
       let count = 1
       let explosionLoop = setInterval(()=>{
           if(countX === 2048){
               document.getElementById('explosion').remove()
               clearInterval(explosionLoop)
           }
           count++
           explosion.style.backgroundPosition = `-${countX}px -${countY}px`

           countX += 256

            if(countX === 2048){
                countX = 0
                countY += 256
                return
               
            }
            if(countY === 2048){
                document.getElementById('explosion').remove()
                clearInterval(explosionLoop)
            }
       }, 1000 / 100)
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
                <SimulatorWindow id="sim-window" style={{ background: `url(${sky})`, minHeight: '100vh', maxHeight: '100vhd       ', backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box', overflowX: 'hidden', overflowY: 'hidden' }}>
                    {/* ship component */}
                    <Rocket style={{ ...rocketPosition }}>
                        <img className="img-fluid" src={rocketImg} alt="" />
                        {/* thrusters */}
                        {
                            this.state.turningClockwise &&
                            <div id="left-thruster-top" style={{ position: 'absolute', width: '8px', height: '2px', background: 'linear-gradient(to left, white, rgba(255,255,255,.4))', top: '4px', left: '-8px' }}></div>

                        }
                        {
                            this.state.turningClockwise &&
                            <div id="right-thruster-bottom" style={{ position: 'absolute', width: '8px', height: '2px', background: 'linear-gradient(to right, white, rgba(255,255,255,.4))', bottom: '4px', right: '-10px' }}></div>

                        }
                        {
                            this.state.turningCounterClockwise &&
                            <div id="right-thruster-top" style={{ position: 'absolute', width: '8px', height: '2px', background: 'linear-gradient(to right, white, rgba(255,255,255,.4))', top: '4px', right: '-8px' }}></div>
                        }
                        {
                            this.state.turningCounterClockwise &&
                            <div id="left-thruster-bottom" style={{ position: 'absolute', width: '8px', height: '2px', background: 'linear-gradient(to left, white, rgba(255,255,255,.4))', bottom: '4px', left: '-10px' }}></div>

                        }

                        {/* engine plume */}
                        <div id="flames" className="flames" style={{ width: '12px', height: `${this.state.thrust / 3}px`, background: 'red', position: 'absolute ', bottom: `${-this.state.thrust / 3}px`, display: this.rocket.accelerating ? 'block' : 'none', ...clipPath }}>
                            <div style={{ width: '6px', position: 'relative', left: '2.7px', height: `${this.state.thrust / 6}px`, background: 'yellow', zIndex: 999, ...clipPath }}>

                            </div>
                        </div>

                    </Rocket>
                    <Info className="transform-transition" style={{ transform: this.state.computationsActive ? `translateX(0)` : `translateX(1000px)`, }}>

                        <div id="info" style={{ color: 'black', background: 'white', borderRadius: '8px' }} className=" text-left mr-5 px-4 py-4">
                            <p className="text-center lead">Computations</p>
                            <div className="container py-3">
                                <div>
                                    <span style={{ fontSize: '2rem' }}>{this.state.isRunning ? 'Running' : 'Waiting'}</span>
                                    <p className="text-muted">Simulator Status</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '2rem' }}>{this.rocket.angle} deg</span>
                                    <p className="text-muted">Orientation</p>

                                </div>
                                <div>
                                    <span style={{ fontSize: '2rem' }}>{(this.rocket.radius - 150).toFixed(0)} km</span>
                                    <p className="text-muted">Altitude </p>

                                </div>
                                <div>
                                    <span style={{ fontSize: '2rem ' }}>{
                                        this.rocket.accelerating ? 'Firing' : 'Static'
                                    }
                                    </span>
                                    <p className="text-muted">Engines</p>

                                </div>
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                    <span style={{fontSize:'2rem'}}>
                                        {this.rocket.x.toFixed(1)}
                                    </span>
                                    <p className="lead">X</p>
                                    </div>
                                    <div>
                                    <span style={{fontSize:'2rem'}}>{this.rocket.y.toFixed(1)}</span>
                                    <p className="lead"> Y</p>
                                    </div>
                                    

                                </div>
                                <p>Velocity: {this.rocket.Vel.toFixed(1) * 10} km/s</p>
                                <p>VelX: {this.rocket.velX.toFixed(1)}, VelY: {this.rocket.velY.toFixed(1)}</p>
                                <p>Gravitational Force: {this.rocket.gravitationalForce.toFixed(2)} N</p>
                                <p>GravityX: {this.rocket.gravityX.toFixed(2)}, GravityY: {this.rocket.gravityY.toFixed(2)}</p>

                                <div>
                                    {/* grades how round/non-eccentric the orbit is */}
                                    <p>Eccentricity Grade: {this.state.grade}</p>
                                </div>
                            </div>

                        </div>
                        <div className="mr-5 mt-3 px-4 py-4" style={{ background: 'white', borderRadius: '8px', }} >
                            <p className="lead">Keyboard Control</p>
                            <button className={`btn btn-lg w-50 btn-outline-secondary mb-3 ${this.state.turningCounterClockwise ? 'active' : ''}`}>A<br></br><i class="fas fa-chevron-left"></i></button>
                            <button className={`btn btn-lg w-50 btn-outline-secondary mb-3 ${this.state.turningClockwise ? 'active' : ''}`}>S<br></br><i class="fas fa-chevron-right"></i></button>
                            <button className={`btn btn-lg w-100 btn-outline-secondary ${this.rocket.accelerating ? 'active' : ''}`}>Space<br></br><i class="fas fa-fire"></i></button>

                        </div>

                    </Info>
                    <animated.div >
                        <Planet style={{ background: `url(${earth})`, backgroundPosition: 'center', backgroundSize: '140%', overflow: 'hidden' }} id="planet">
                            <div id="atmosphere-overlay" style={{ opacity: .7, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: `radial-gradient(circle at 25% 25%, rgba(255,255,255,.5) 0%,rgba(00,00,00,.8))` }}>

                            </div>

                        </Planet>

                    </animated.div>
                    <div id="controls" className="px-4 py-4 text-left ml-5 transform-transition" style={{
                        position: 'absolute',
                        background: '#ffffff',
                        transform: this.state.controlsActive ? `translateX(0)` : `translateX(-1000px)`,
                        left: 0, display: 'flex', flexDirection: 'column', borderRadius: '8px'
                    }}>
                        <p className=" lead text-center">Simulation Control</p>



                        <div className="py-3 d-flex flex-row container">
                            <div className="row">
                                <div className="p-2 col-3">
                                    <i class="fas fa-globe-americas mr-3 fa-4x text-secondary" style={{ opacity: '.3' }}></i>
                                </div>
                                <div className="col-9">
                                    <div>
                                        <span className="lead font-weight-bold text-secondary" style={{ fontSize: '2rem' }}>{this.state.planetaryMass} x10<sup>24</sup>kg</span>
                                    </div>
                                    <label htmlFor="Planetary Mass" className="text-muted">Planetary Mass</label><br />
                                    <input type="range" className="w-100 slider-style" min={.1} max={10} step={.1} onChange={e => this.updatePlanetaryMass(e)} value={this.state.planetaryMass} name="Planetary Mass" id="" />
                                </div>
                            </div>


                        </div>
                        <hr />
                        <div className="py-3 d-flex flex-row container">

                            <div className="row">
                                <div className="p-2 col-3">
                                    <i class="fas fa-rocket mr-3 fa-4x text-secondary" style={{ opacity: '.3' }}></i>
                                </div>
                                <div className="col-9">
                                    <div>
                                        <span className="font-weight-bold text-secondary" style={{ fontSize: '2rem' }}>{this.rocket.mass} kg</span>
                                    </div>
                                    <label htmlFor="Spacecraft Mass" className="text-muted">Spacecraft Mass</label><br />
                                    <input type="range" className="w-100 slider-style" min={0} max={100} value={this.rocket.mass} name="Spacecraft Mass" id="" />
                                </div>
                            </div>

                        </div>
                        <hr />
                        <div className="py-3 d-flex flex-row container">
                            <div className="row">
                                <div className="p-2 col-3">
                                    <i class="fas fa-fire mr-3 fa-4x text-secondary" style={{ opacity: '.3' }}></i>
                                </div>
                                <div className=" col-9">
                                    <div>
                                        <span className="font-weight-bold text-secondary" style={{ fontSize: '2rem' }}>{this.state.thrust} kN</span>
                                    </div>
                                    <label htmlFor="Engine Thrust" className="text-muted">Engine Thrust</label><br />
                                    <input type="range" className="w-100 slider-style" min={1} step={1} max={100} value={this.state.thrust} name="Engine Thrust" id="" onChange={e => this.updateThrust(e)} />
                                </div>
                            </div>


                        </div>
                        <div className="mt-3">
                            <Button className="btn btn-outline-secondary btn-lg w-100 mb-3 " onClick={this.revertDefaultSettings.bind(this)}>DEFAULT SETTINGS</Button>

                            <Button className="btn btn-outline-secondary btn-lg w-100 " onClick={this.resetSimulator.bind(this)}>RESET SHIP</Button>
                        </div>
                    </div>
                </SimulatorWindow>
                <div id="toggles" style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '50px' }}>
                    <div className="btn-group">
                        <button className={`btn btn-secondary btn-custom ${this.state.controlsActive ? 'active' : ''}`} onClick={e => this.toggleControls()}>
                            Controls
                    </button>
                        <button className={`btn btn-secondary btn-custom ${this.state.computationsActive ? 'active' : ''}`} onClick={e => this.toggleComputations()}>
                            Computations
                    </button>
                    </div>

                </div>
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
    position: relative;
`
const Info = styled.div`
    position: absolute;
    right: 0;
`
// planet
const Planet = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 300px;
    position: relative;
    z-index: 100;
    border-radius: 100%;
    /* &::before{
        content:'sd';
        background: red;
        position:absolute;
        height:100%;
        width:100%;
    } */
`
// ship
const Rocket = styled.div`
    width: 12px;
    /* border-top: 2px solid red; */
    height: 20px;
    display:flex;
    justify-content:center;
    /* background: yellow; */
    position: absolute;
    z-index: 99;
`

// control
const Button = styled.button`
    width: 80px;
    padding: 10px;
    box-sizing: border-box;
`