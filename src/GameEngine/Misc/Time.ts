abstract class Time {

    private static deltaTime: number = 0;
    private static prevTime: number = 0;


    public static get DeltaTime(): number {
        return this.deltaTime;
    }

    public static updateTime(): void {
        if(this.prevTime === 0) {
            this.prevTime = Date.now();
        }
        else {
            this.deltaTime = (Date.now() - this.prevTime) / 1000;
            this.prevTime = Date.now();
        }
    }
}