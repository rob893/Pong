/// <reference path="Motor.ts" />

class ComputerMotor extends Motor {

    public constructor(gameObject: GameObject) {
        super("ComputerMotor", gameObject);

        this.yVelocity = 1;
    }

    protected handleOutOfBounds(): void {
        if(this.transform.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if(this.transform.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }
    }

    protected move(): void {
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
}