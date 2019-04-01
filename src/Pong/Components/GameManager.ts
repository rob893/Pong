class GameManager extends Component {

    private static instance: GameManager;


    private constructor(componentName: string, gameObject: GameObject) {
        super(componentName, gameObject);

        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
    }

    public static get Instance(): GameManager {
        if(this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }

        return this.instance;
    }

    public static createInstance(componentName: string, gameObject: GameObject): GameManager {
        if(this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(componentName, gameObject);
            return this.instance;
        }
        
        throw new Error("More than one GameManager cannot be created!");
    }

    private togglePause(): void {
        GameEngine.Instance.togglePause();
    }

    private printGameData(): void {
        GameEngine.Instance.printGameData();
    }
}