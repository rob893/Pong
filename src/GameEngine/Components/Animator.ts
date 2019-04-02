/// <reference path="./Component.ts" />

class Animator extends Component {

    private frameWidth: number;
    private frameHeight: number;
    private numberOfFrames: number;
    private frameIndex: number;
    private tickCount: number;
    private ticksPerFrame: number = 1;
    private spriteSheet: HTMLImageElement;
    private canvasContext: CanvasRenderingContext2D;
    private transform: Transform;
    private spriteReady: boolean;


    public constructor(gameObject: GameObject, spriteSheetURL: string, numberOfFrames: number) {
        super("Animator", gameObject);
        this.spriteReady = false;
        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetURL;
        this.spriteSheet.onload = () => { this.spriteReady = true; };
        this.numberOfFrames = numberOfFrames;
    }

    public start(): void {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }

    public update(): void {
        this.drawSprite();
    }

    private drawSprite(): void {
        
        if(!this.spriteReady) {
            return;
        }

        this.tickCount = this.ticksPerFrame;

        if (this.tickCount >= this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }

        this.frameHeight = this.spriteSheet.height;
        this.frameWidth = this.spriteSheet.width / this.numberOfFrames;

        //this.position.setWidth(this.frameWidth);
        //this.position.getHeight(this.frameHeight);
        this.canvasContext.drawImage(this.spriteSheet,
            this.frameIndex * this.frameWidth, 0,   // Start of slice
            this.frameWidth, this.frameHeight, // Size of slice
            this.transform.position.x, this.transform.position.y, 15, 20);
    }
}