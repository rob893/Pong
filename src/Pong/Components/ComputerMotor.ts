/// <reference path="Motor.ts" />

class ComputerMotor extends Motor {

    private ballTransform: Transform;
    private timer: number = 0;
    private midField: number;


    public constructor(gameObject: GameObject) {
        super("ComputerMotor", gameObject);

        this.yVelocity = 1;
    }

    public start(): void {
        super.start();

        this.ballTransform = GameEngine.Instance.getGameObjectById("ball").getTransform();
        this.midField = this.gameCanvas.width / 2;
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.yVelocity = 1;
        }
        else if(this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = -1;
        }
    }

    protected move(): void {
        if(this.ballTransform.position.x < this.midField) {
            this.yVelocity = 0;
            return;
        }

        this.timer += Time.DeltaTime;

        if(this.timer > 0.25) {
            if(this.transform.getCenter().y < this.ballTransform.getCenter().y) {
                this.yVelocity = 1;
            }
            else {
                this.yVelocity = -1;
            }

            this.timer = 0;
        }

        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
}