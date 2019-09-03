

export default class Ship{
    constructor(accelerationConstant, gravity, modifyer, windowX, windowY){
        this.accelerationConstant = accelerationConstant
        this.gravity = gravity
        this.modifyer = modifyer
        this.angle = 0
        this.accelerating = false
        this.velX = 0
        this.velY = 0
        this.x = 0
        this.y = 0
        this.gravityX = 0
        this.gravityY = 0
        this.canvasX = windowX
        this.canvasY = windowY
        console.log(this)
    }
    resetShip(canvasX, canvasY, planetRadius){
        this.canvasX = canvasX
        this.canvasY = canvasY
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
                console.log(Math.sin(this.angle))
            
        }
    }

    // measure gravity vector from middle of canvas
    gravityAccelerate(canvasX, canvasY){
        let dX = this.x - (canvasX / 2) + 1
        let dY = this.y - (canvasY / 2)
        // find tan by opposite over adjacent
        let ratio = (dY/dX)
        let radians = Math.atan(ratio)
        let gY = this.gravity * Math.sin(radians)
        let gX = this.gravity * Math.cos(radians)
        this.gravityX = Math.abs(gX * this.modifyer)
        this.gravityY = Math.abs(gY * this.modifyer)

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
        console.log(this.angle)
    }
    turnCounterClockwise(){
        this.angle -= 2
        if(this.angle <= 0){
            this.angle = 360
        }
        console.log(this.angle)
    }
}