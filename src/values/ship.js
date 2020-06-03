import constants from './constants'

export default class Ship{
    interval
    constructor(accelerationConstant, gravity, modifyer, windowX, windowY, radius){
        this.accelerationConstant = accelerationConstant
        this.gravity = gravity
        this.modifyer = modifyer
        this.angle = 0
        this.accelerating = false
        this.velX = 0
        this.Vel = 0
        this.gravitationalForce = 0
        this.velY = 0
        this.canvasX = windowX
        this.canvasY = windowY
        this.x = this.canvasX / 2
        this.y = this.canvasY / 2 + radius
        this.gravityX = 0
        this.gravityY = 0
        this.mass = 20000
        this.planetMass = 5.9722
        this.collision = false
        console.log(this)
        // place ship
    }
    resetShip(canvasX, canvasY, planetRadius, interval){
        this.interval = interval
        clearInterval(interval)
        this.canvasX = canvasX
        this.canvasY = canvasY
        this.velX = 0
        this.velY = 0 
        // set x to midway point through canvas
        this.x = canvasX/2
        // set y to midway point minus radius
        this.y = (canvasY/2)+planetRadius
        this.angle = 0
    }
    // set boolean for changing velocity or not
    setAcceleration(isAccelerating){
        this.accelerating = isAccelerating
    }
    // accelerate velocity if isAccelerating bool is true
    accelerate(){
        if(this.accelerating){
                // determine x and y components of angular vector
                // must convert from degrees to radians
                this.velX += (this.accelerationConstant * Math.sin(this.angle*(Math.PI/180)))*this.modifyer 
                this.velY += (this.accelerationConstant * Math.cos(this.angle*(Math.PI/180)))*this.modifyer
                // console.log(Math.sin(this.angle))
            
        }
    }

    // measure gravity vector from middle of canvas
    gravityAccelerate(canvasX, canvasY){
        let dX = this.x - (canvasX / 2) + 1
        let dY = this.y - (canvasY / 2)
        let gravitationForce = this.calculate_gravity(dX, dY)
        this.gravitationalForce = gravitationForce
        // find tan by opposite over adjacent
        let ratio = (dY/dX)
        let radians = Math.atan(ratio)
        let gY = gravitationForce * Math.sin(radians)
        let gX = gravitationForce * Math.cos(radians)
        this.gravityX = Math.abs(gX * this.modifyer)
        this.gravityY = Math.abs(gY * this.modifyer)

    }
    // gravity force formula
    calculate_gravity(dX, dY){
        let radius2 = Math.pow(dX,2) + Math.pow(dY,2)
        let radius = Math.sqrt(radius2) 
        let force = (constants.gravity ) * (this.mass/(this.planetMass * 1000)) / (Math.pow(radius, 2)) * 500000
        return force
    }
    // break down gravitational force into x and y components
    calculate_gravity_components(){
        let aX
        let aY


        return {aX: aX, aY: aY}  // returns acceleration by gravity in each vector
    }
    // calculate distance from center of mass of planet, hypotenuse from triangle, a^2+b^2=c^2
    calculate_distance(){
        let a = this.x - (this.canvasX / 2) + 1
        let b = this.y - (this.canvasY / 2)
        let c2 = Math.pow(a,2) + Math.pow(b,2)
        let c = Math.sqrt(c2).toFixed(2)
        return c
    }
    // move ship using current acceleration components and gravity
    moveShip(){
        // apply gravity to vx and vy
        if(this.x > (this.canvasX / 2)){
            this.velX -= this.gravityX
        }
        else{
            this.velX += this.gravityX
        }
        if(this.y > this.canvasY / 2){
            this.velY -= this.gravityY
        }
        else{
            this.velY += this.gravityY
        }
        let Vel2 = Math.abs(this.velX, 2)+ Math.abs(this.velY,2)
        this.Vel = Math.sqrt(Vel2)
        // move ship
        this.x += (this.velX)* this.modifyer
        this.y += (this.velY)* this.modifyer
    }

    // getter for individual velocity components
    returnVelocityX(angle, acceleration){
        
    }
    returnVelocityY(angle, acceleration){

    }

    // change angle of attack
    turnClockwise(){
        this.angle += 2
        if(this.angle >= 360){
            this.angle = 0
        }
    }
    turnCounterClockwise(){
        this.angle -= 2
        if(this.angle <= 0){
            this.angle = 360
        }
        console.log(this.angle)
    }
    detectCollision(){
        let dx = Math.abs(this.x - (this.canvasX / 2))
        let dy = Math.abs(this.y - (this.canvasY / 2))
        let c2 = Math.pow(dx,2) + Math.pow(dy,2)
        let c = Math.sqrt(c2)
        if(c < 145){
            console.log('Collision!')
            this.collision = true
        }
    }

}