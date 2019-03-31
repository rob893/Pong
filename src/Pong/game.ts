let gameEngine: GameEngine = GameEngine.Instance;

let gameCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");

let player: Player = new Player("player");
let ball: Ball = new Ball("ball");
let computer: Computer = new Computer("computer");

let gameObjects: GameObject[] = [player, computer, ball];

gameEngine.initializeGame(gameCanvas, gameObjects);

gameEngine.startGame();