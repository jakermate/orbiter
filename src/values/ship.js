export default class Ship{
    constructor(){
        this.angle = 0
        this.accelerating = false
        this.velX = 0
        this.velY = 0
    }
    setAcceleration(isAccelerating){
        this.accelerating = isAccelerating
    }
    returnVelocityX(angle, acceleration){
        
    }
    returnVelocityY(angle, acceleration){

    }
    turnClockwise(){
        this.angle += 2
        console.log(this.angle)
    }
    turnCounterClockwise(){
        this.angle -= 2
        console.log(this.angle)
    }
}