export default class PlayerControls {

    input: Phaser.Input = null;
    game: Phaser.Game = null;

    constructor(input, game) {
        this.input = input;
        this.game = game;
    }
    upInputIsActive(duration) {
        let isActive = false;
        isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
        return isActive;
    };

    leftInputIsActive() {
        let isActive = false;
        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        return isActive;
    };
    rightInputIsActive() {
        let isActive = false;
        isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        return isActive;
    };

    upInputReleased() {
        let released = false;
        released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
        if (released)
            this.game.input.activePointer.justReleased();
        return released;
    };

    RetryInputIsActive() {
        let isActive = false;
        isActive = this.input.keyboard.isDown(Phaser.Keyboard.X);
        return isActive;
    };

}