class Transform extends Component implements IObservable {

    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    private observers: IObserver[] = [];


    public constructor(gameObject: GameObject, x: number, y: number, width: number, height: number) {
        super("Transform", gameObject);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public translate(xVelocity: number, yVelocity: number, speed: number): void {
        this.y += yVelocity * speed;
        this.x += xVelocity * speed;
        this.notifyObservers();
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