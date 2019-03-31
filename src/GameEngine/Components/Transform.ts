class Transform extends Component implements IObservable {

    public width: number = 0;
    public height: number = 0;
    //Position is the top left of the agent with width growing right and height growing down.
    public readonly position: Vector2;

    private observers: IObserver[] = [];


    public constructor(gameObject: GameObject, x: number, y: number, width: number, height: number) {
        super("Transform", gameObject);
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }

    public translate(xVelocity: number, yVelocity: number, speed: number): void {
        this.position.x += xVelocity * speed;
        this.position.y += yVelocity * speed;
        this.notifyObservers();
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.notifyObservers();
    }

    public getCenter(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }

    public getBottomCenter(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }

    public registerObserver(observer: IObserver): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: IObserver): void {
        for(let i: number = 0; i < this.observers.length; i++) {
            if(this.observers[i] === observer) {
                this.observers.splice(i, 1);
            }
        }
    }

    public notifyObservers(): void {
        for(let i: number = 0; i < this.observers.length; i++) {
            this.observers[i].receiveObservableUpdate();
        }
    }
}