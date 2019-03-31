class GameEngine {
    constructor() {
        this.gameObjects = [];
        this.gameInitialized = false;
        this.paused = false;
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        this.gameInitialized = false;
    }
    static get Instance() {
        return this.instance || (this.instance = new GameEngine());
    }
    initializeGame(gameCanvas, gameObjects) {
        this.setGameCanvas(gameCanvas);
        this.setGameObjects(gameObjects);
        this.gameInitialized = true;
    }
    startGame() {
        if (!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }
        Time.start();
        this.paused = false;
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    getGameObjectById(id) {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (gameObjects[i].id === id) {
                return gameObjects[i];
            }
        }
        throw new Error("No GameObject with id of " + id + " exists!");
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getGameCanvasContext() {
        return this.canvasContext;
    }
    printGameData() {
        console.log(Time.TotalTime);
        for (let i = 0; i < this.gameObjects.length; i++) {
            console.log(this.gameObjects[i]);
        }
    }
    togglePause() {
        this.paused = !this.paused;
    }
    setGameCanvas(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }
    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects;
    }
    update() {
        Time.updateTime();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update();
        }
    }
    renderGameObjects() {
        this.canvasContext.fillStyle = "black";
        this.canvasContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].render();
        }
    }
    gameLoop() {
        if (!this.paused) {
            this.update();
            this.renderGameObjects();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}
class GameObject {
    constructor(id, x, y, width, height) {
        this.color = "white";
        this.components = [];
        this.id = id;
        this.transform = new Transform(this, x, y, width, height);
    }
    start() {
        this.gameCanvas = GameEngine.Instance.getGameCanvas();
        this.canvasContext = gameCanvas.getContext("2d");
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }
    update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }
    render() {
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
    getTransform() {
        return this.transform;
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getComponent(componentType) {
        componentType = componentType.toLowerCase();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].componentName.toLowerCase() === componentType) {
                return this.components[i];
            }
        }
        throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
    }
    setComponents(components) {
        this.components = components;
    }
}
class Component {
    constructor(componentName, gameObject) {
        this.gameObject = gameObject;
        this.componentName = componentName;
    }
    start() { }
    ;
    update() { }
    ;
}
class RectangleCollider extends Component {
    constructor(gameObject) {
        super("RectangleCollider", gameObject);
        this.transform = gameObject.getTransform();
        let transform = this.transform;
        transform.registerObserver(this);
        this.topLeft = new Vector2(transform.position.x, transform.position.y);
        this.topRight = new Vector2(transform.position.x + transform.width, transform.position.y);
        this.bottomLeft = new Vector2(transform.position.x, transform.position.y + transform.height);
        this.bottomRight = new Vector2(transform.position.x + transform.width, transform.position.y + transform.height);
    }
    detectCollision(other) {
        return !(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y);
    }
    receiveObservableUpdate() {
        this.topLeft.x = this.transform.position.x;
        this.topLeft.y = this.transform.position.y;
        this.topRight.x = this.transform.position.x + this.transform.width;
        this.topRight.y = this.transform.position.y;
        this.bottomLeft.x = this.transform.position.x;
        this.bottomLeft.y = this.transform.position.y + this.transform.height;
        this.bottomRight.x = this.transform.position.x + this.transform.width;
        this.bottomRight.y = this.transform.position.y + this.transform.height;
    }
}
class Transform extends Component {
    constructor(gameObject, x, y, width, height) {
        super("Transform", gameObject);
        this.width = 0;
        this.height = 0;
        this.observers = [];
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }
    translate(xVelocity, yVelocity, speed) {
        this.position.x += xVelocity * speed;
        this.position.y += yVelocity * speed;
        this.notifyObservers();
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.notifyObservers();
    }
    getCenter() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }
    getBottomCenter() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }
    registerObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        for (let i = 0; i < this.observers.length; i++) {
            if (this.observers[i] === observer) {
                this.observers.splice(i, 1);
            }
        }
    }
    notifyObservers() {
        for (let i = 0; i < this.observers.length; i++) {
            this.observers[i].receiveObservableUpdate();
        }
    }
}
var Keys;
(function (Keys) {
    Keys[Keys["UP"] = 38] = "UP";
    Keys[Keys["DOWN"] = 40] = "DOWN";
})(Keys || (Keys = {}));
class Time {
    static get DeltaTime() {
        return this.deltaTime;
    }
    static get TotalTime() {
        return (Date.now() - this.startTime) / 1000;
    }
    static start() {
        this.prevTime = Date.now();
        this.startTime = this.prevTime;
    }
    static updateTime() {
        this.deltaTime = (Date.now() - this.prevTime) / 1000;
        this.prevTime = Date.now();
    }
}
Time.deltaTime = 0;
Time.startTime = 0;
Time.prevTime = 0;
class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    static distance(point1, point2) {
        let distanceX = point1.x - point2.x;
        let distanceY = point1.y - point2.y;
        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
}
class Motor extends Component {
    constructor(componentName, gameObject) {
        super(componentName, gameObject);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 5;
        this.transform = gameObject.getTransform();
    }
    start() {
        this.gameCanvas = this.gameObject.getGameCanvas();
    }
    update() {
        this.move();
        this.handleOutOfBounds();
    }
}
class BallMotor extends Motor {
    constructor(gameObject) {
        super("BallMotor", gameObject);
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent("RectangleCollider");
        this.playerCollider = GameEngine.Instance.getGameObjectById("player").getComponent("RectangleCollider");
        this.computerCollider = GameEngine.Instance.getGameObjectById("computer").getComponent("RectangleCollider");
    }
    update() {
        super.update();
        this.handleCollisions();
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }
        if (this.transform.position.x + this.transform.width <= 0) {
            this.reset();
        }
        else if (this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }
    move() {
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
    reset() {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
    handleCollisions() {
        if (this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = 1;
            this.speed += 0.125;
        }
        else if (this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity = -1;
            this.speed += 0.125;
        }
    }
}
class ComputerMotor extends Motor {
    constructor(gameObject) {
        super("ComputerMotor", gameObject);
        this.timer = 0;
        this.yVelocity = 1;
    }
    start() {
        super.start();
        this.ballTransform = GameEngine.Instance.getGameObjectById("ball").getTransform();
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = 1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = -1;
        }
    }
    move() {
        if (this.ballTransform.position.x < this.quarterFieldX) {
            if (this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = -1;
            }
            else if (this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = 1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += Time.DeltaTime;
            if (this.timer > 0.15) {
                if (this.transform.getCenter().y < this.ballTransform.getCenter().y - 10) {
                    this.yVelocity = 1;
                }
                else if (this.transform.getCenter().y > this.ballTransform.getCenter().y + 10) {
                    this.yVelocity = -1;
                }
                else {
                    this.yVelocity = 0;
                }
                this.timer = 0;
            }
        }
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
}
class PlayerMotor extends Motor {
    constructor(gameObject) {
        super("PlayerMotor", gameObject);
        this.movingUp = false;
        this.movingDown = false;
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('keyup', () => this.onKeyUp(event));
        document.getElementById("white-button").addEventListener("click", () => { this.gameObject.color = "white"; });
        document.getElementById("red-button").addEventListener("click", () => { this.gameObject.color = "red"; });
        document.getElementById("blue-button").addEventListener("click", () => { this.gameObject.color = "blue"; });
        document.getElementById("green-button").addEventListener("click", () => { this.gameObject.color = "green"; });
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
        }
    }
    move() {
        if (this.movingUp) {
            this.yVelocity = -1;
            this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
        }
        else if (this.movingDown) {
            this.yVelocity = 1;
            this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
        }
        else {
            this.yVelocity = 0;
        }
    }
    onKeyDown(event) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = true;
            this.movingUp = false;
        }
    }
    onKeyUp(event) {
        if (event.keyCode == Keys.UP) {
            this.movingUp = false;
        }
        else if (event.keyCode == Keys.DOWN) {
            this.movingDown = false;
        }
    }
}
class Ball extends GameObject {
    constructor(id) {
        super(id, 345, 195, 10, 10);
        let ballComponents = [];
        ballComponents.push(new RectangleCollider(this));
        ballComponents.push(new BallMotor(this));
        this.setComponents(ballComponents);
    }
}
class Computer extends GameObject {
    constructor(id) {
        super(id, 688, 175, 10, 50);
        let computerComponents = [];
        computerComponents.push(new RectangleCollider(this));
        computerComponents.push(new ComputerMotor(this));
        this.setComponents(computerComponents);
    }
}
class Player extends GameObject {
    constructor(id) {
        super(id, 2, 175, 10, 50);
        let playerComponents = [];
        playerComponents.push(new RectangleCollider(this));
        playerComponents.push(new PlayerMotor(this));
        this.setComponents(playerComponents);
    }
}
let gameEngine = GameEngine.Instance;
let gameCanvas = document.getElementById("game-canvas");
let player = new Player("player");
let ball = new Ball("ball");
let computer = new Computer("computer");
let gameObjects = [player, computer, ball];
gameEngine.initializeGame(gameCanvas, gameObjects);
gameEngine.startGame();
//# sourceMappingURL=game.js.map