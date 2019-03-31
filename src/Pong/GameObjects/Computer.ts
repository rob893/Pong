class Computer extends GameObject {

    public constructor(id: string) {
        super(id, 688, 175, 10, 50);

        let computerComponents: Component[] = [];
        
        computerComponents.push(new RectangleCollider(this));
        computerComponents.push(new ComputerMotor(this));

        this.setComponents(computerComponents);
    }
}