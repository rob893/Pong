class GameEngine {

    private static instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private gameObjects: GameObject[] = [];


    private constructor() {
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
    }

    public static get Instance(): GameEngine {
        return this.instance || (this.instance = new GameEngine());
    }

    public setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = gameObjects;

        for(let i: number = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }
    }

    public setGameCanvas(gameCanvas: HTMLCanvasElement): void {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }

    public getGameObjectById(id: string): GameObject {
        for(let i: number = 0; i < this.gameObjects.length; i++) {
            if(gameObjects[i].id === id) {
                return gameObjects[i];
            }
        }

        throw new Error("No GameObject with id of " + id + " exists!");
    }

    public getGameCanvas(): HTMLCanvasElement {
        return this.gameCanvas;
    }

    public getGameCanvasContext(): CanvasRenderingContext2D {
        return this.canvasContext;
    }

    private printGameData(): void {
        console.log(player);
        console.log(ball);
        console.log(computer);
    }

    private update(): void {
        for(let i: number = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update();
        }
    }

    private renderGameObjects(): void {
        this.canvasContext.fillStyle = "black"; 
        this.canvasContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        for(let i: number = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].render();
        }
    }

    public gameLoop(): void {
        this.update();
        this.renderGameObjects();
        requestAnimationFrame(() => this.gameLoop());
    }
}