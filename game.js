class GameEngine {
    constructor() {
        this.gameObjects = [];
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
    }
    static get Instance() {
        return this.instance || (this.instance = new GameEngine());
    }
    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects;
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].start();
        }
    }
    setGameCanvas(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
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
        console.log(player);
        console.log(ball);
        console.log(computer);
    }
    update() {
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
        this.update();
        this.renderGameObjects();
        requestAnimationFrame(() => this.gameLoop());
    }
}
class GameObject {
    constructor(id, x, y, width, height) {
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
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(this.transform.x, this.transform.y, this.transform.width, this.transform.height);
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
        this.topLeft = new Vector2(transform.x, transform.y);
        this.topRight = new Vector2(transform.x + transform.width, transform.y);
        this.bottomLeft = new Vector2(transform.x, transform.y + transform.height);
        this.bottomRight = new Vector2(transform.x + transform.width, transform.y + transform.height);
    }
    detectCollision(other) {
        return !(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y);
    }
    receiveObservableUpdate() {
        this.topLeft.x = this.transform.x;
        this.topLeft.y = this.transform.y;
        this.topRight.x = this.transform.x + this.transform.width;
        this.topRight.y = this.transform.y;
        this.bottomLeft.x = this.transform.x;
        this.bottomLeft.y = this.transform.y + this.transform.height;
        this.bottomRight.x = this.transform.x + this.transform.width;
        this.bottomRight.y = this.transform.y + this.transform.height;
    }
}
class Transform extends Component {
    constructor(gameObject, x, y, width, height) {
        super("Transform", gameObject);
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.observers = [];
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    translate(xVelocity, yVelocity, speed) {
        this.y += yVelocity * speed;
        this.x += xVelocity * speed;
        this.notifyObservers();
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
class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
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
        if (this.transform.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if (this.transform.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }
        if (this.transform.x <= 0) {
            this.reset();
        }
        else if (this.transform.x >= this.gameCanvas.width) {
            this.reset();
        }
    }
    move() {
        this.transform.translate(this.xVelocity, this.yVelocity, this.speed);
    }
    reset() {
        this.transform.x = 345;
        this.transform.y = 195;
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
    handleCollisions() {
        if (this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = Math.abs(this.xVelocity);
        }
        else if (this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity *= -1;
        }
    }
}
class ComputerMotor extends Motor {
    constructor(gameObject) {
        super("ComputerMotor", gameObject);
        this.yVelocity = 1;
    }
    handleOutOfBounds() {
        if (this.transform.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if (this.transform.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity *= -1;
        }
    }
    move() {
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
    }
    handleOutOfBounds() {
        if (this.transform.y <= 0) {
            this.transform.y = 0;
        }
        else if (this.transform.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.y = this.gameCanvas.height - this.transform.height;
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
gameEngine.setGameCanvas(gameCanvas);
let player = new Player("player");
let ball = new Ball("ball");
let computer = new Computer("computer");
let gameObjects = [player, computer, ball];
gameEngine.setGameObjects(gameObjects);
requestAnimationFrame(() => gameEngine.gameLoop());
//# sourceMappingURL=game.js.map