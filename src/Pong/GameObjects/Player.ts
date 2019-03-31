class Player extends GameObject {

    public constructor(id: string) {
        super(id, 2, 175, 10, 50);

        let playerComponents: Component[] = [];
        
        playerComponents.push(new RectangleCollider(this));
        playerComponents.push(new PlayerMotor(this));

        this.setComponents(playerComponents);
    }
}