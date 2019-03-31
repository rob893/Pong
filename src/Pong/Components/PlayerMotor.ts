/// <reference path="Motor.ts" />

class PlayerMotor extends Motor {

    private movingUp: boolean = false;
    private movingDown: boolean = false;


    public constructor(gameObject: GameObject) {
        super("PlayerMotor", gameObject);

        document.addEventListener('keydown', () => this.onKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.onKeyUp(<KeyboardEvent>event));

        document.getElementById("white-button").addEventListener("click", () => { this.gameObject.color = "white"; });
        document.getElementById("red-button").addEventListener("click", () => { this.gameObject.color = "red"; });
        document.getElementById("blue-button").addEventListener("click", () => { this.gameObject.color = "blue"; });
        document.getElementById("green-button").addEventListener("click", () => { this.gameObject.color = "green"; });
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if(this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
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