/// <reference path="Motor.ts" />

class PlayerMotor extends Motor {

    private movingUp: boolean = false;
    private movingDown: boolean = false;


    public constructor(gameObject: GameObject) {
        super("PlayerMotor", gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));
    }

    protected handleOutOfBounds(): void {
        if(this.transform.y <= 0) {
            this.transform.y = 0;
        }
        else if(this.transform.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.y = this.gameCanvas.height - this.transform.height;
        }
    }

    protected move(): void {
        if(this.movingUp) {
            this.yVelocity = -1;
            this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
        }
        else if(this.movingDown) {
            this.yVelocity = 1;
            this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
        }
        else {
            this.yVelocity = 0;
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        if(event.keyCode == Keys.UP) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if(event.keyCode == Keys.DOWN) {
            this.movingDown = true;
            this.movingUp = false;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if(event.keyCode == Keys.UP) {
            this.movingUp = false;
        }
        else if(event.keyCode == Keys.DOWN) {
            this.movingDown = false;
        }
    }
}