abstract class GameObject {
    
    public readonly id: string;
    public color: string = "white";

    protected transform: Transform;
    protected gameCanvas: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected components: Component[] = [];
    

    public constructor(id: string, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.transform = new Transform(this, x, y, width, height);
    }

    public start(): void {
        this.gameCanvas = GameEngine.Instance.getGameCanvas();
        this.canvasContext = gameCanvas.getContext("2d");

        for(let i: number = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }

    public update(): void {
        for(let i: number = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }

    public render(): void {
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }

    public getTransform(): Transform {
        return this.transform;
    }

    public getGameCanvas(): HTMLCanvasElement {
        return this.gameCanvas;
    }

    public getComponent<T extends Component>(componentType: string): T {
        componentType = componentType.toLowerCase();

        for(let i: number = 0; i < this.components.length; i++) {
            if(this.components[i].componentName.toLowerCase() === componentType) {
                return <T>this.components[i];
            }
        }
    
        throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
    }

    protected setComponents(components: Component[]): void {
        this.components = components;
    }
}