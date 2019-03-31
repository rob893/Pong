/// <reference path="Motor.ts" />

class BallMotor extends Motor {

    private playerCollider: RectangleCollider;
    private computerCollider: RectangleCollider;
    private collider: RectangleCollider;


    public constructor(gameObject: GameObject) {
        super("BallMotor", gameObject);

        this.reset();
    }

    public start(): void {
        super.start();

        this.collider = this.gameObject.getComponent<RectangleCollider>("RectangleCollider");
        this.playerCollider = GameEngine.Instance.getGameObjectById("player").getComponent<RectangleCollider>("RectangleCollider");
        this.computerCollider = GameEngine.Instance.getGameObjectById("computer").getComponent<RectangleCollider>("RectangleCollider");
    }

    public update(): void {
        super.update();
        
        this.handleCollisions();
    }

    protected handleOutOfBounds(): void {
        if(this.transform.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if(this.transform.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }

        if(this.transform.x <= 0) {
            this.reset();
        }
        else if(this.transform.x >= this.gameCanvas.width) {
            this.reset();
        }
    }

    protected move(): void {
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }

    private reset(): void {
        this.transform.x = 345;
        this.transform.y = 195;
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }

    private handleCollisions(): void {
        if(this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = Math.abs(this.xVelocity);
        }
        else if(this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity *= -1;
        }
    }
}