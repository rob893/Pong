class GameEngine {

    private static instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private gameObjects: GameObject[] = [];
    private gameInitialized: boolean = false;
    private paused: boolean = false;


    private constructor() {
        this.gameInitialized = false;
    }

    public static get Instance(): GameEngine {
        return this.instance || (this.instance = new GameEngine());
    }

    public initializeGame(gameCanvas: HTMLCanvasElement, gameObjects: GameObject[]): void {
        this.setGameCanvas(gameCanvas);
        this.setGameObjects(gameObjects);

        this.gameInitialized = true;
    }

    public startGame(): void {

        if(!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }

        Time.start();
        this.paused = false;

        for(let i: number = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    public instantiate(newGameObject: GameObject): GameObject {
        this.gameObjects.push(newGameObject);
        newGameObject.start();
        
        return newGameObject;
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

    public printGameData(): void {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");

        for(let i: number = 0; i < this.gameObjects.length; i++) {
            console.log(this.gameObjects[i]);
        }
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    private setGameCanvas(gameCanvas: HTMLCanvasElement): void {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = gameObjects;
    }

    private update(): void {
        Time.updateTime();
        
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

    private gameLoop(): void {
        if(!this.paused) {
            this.update();
            this.renderGameObjects();
        }
       
        requestAnimationFrame(() => this.gameLoop());
    }
}