export default class Ship{
    constructor(accelerationConstant, gravity){
        this.accelerationConstant = accelerationConstant
        this.gravity = gravity
        this.angle = 0
        this.accelerating = false
        this.velX = 0
        this.velY = 0
        this.x = 0
        this.y = 0
        console.log(this)
    }
    resetShip(canvasX, canvasY, planetRadius){
        // set x to midway point through canvas
        this.x = canvasX/2
        // set y to midway point minus radius
        this.y = (canvasY/2)-planetRadius
        console.log(`Ship position: ${this.x}, ${this.y}`)
        this.angle = 0
    }
    // set boolean for changing velocity or not
    setAcceleration(isAccelerating){
        this.accelerating = isAccelerating
    }
    // accelerate velocity if isAccelerating bool is true
    accelerate(){
        if(this.isAccelerating){
            this.velY += this.accelerationConstant
        }
    }

    // move ship using current acceleration
    moveShip(){
        this.y += this.velY
    }

    // getter for individual velocity components
    returnVelocityX(angle, acceleration){
        
    }
    returnVelocityY(angle, acceleration){

    }

    // change angle of attack
    turnClockwise(){
        this.angle += 2
        if(this.angle > 360){
            this.angle = 2
        }
        console.log(this.angle)
    }
    turnCounterClockwise(){
        this.angle -= 2
        if(this.angle < 0){
            this.angle = 358
        }
        console.log(this.angle)
    }
}