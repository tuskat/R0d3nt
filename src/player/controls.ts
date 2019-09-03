export default class PlayerControls {

    input: Phaser.Input = null;
    game: Phaser.Game = null;

    constructor(input, game) {
        this.input = input;
        this.game = game;
    }

    keyReleased(key) {
        let released = false;
        released = this.input.keyboard.upDuration(key, 1000);
        return released;
    };

    upInputReleased() {
     if (this.keyReleased(Phaser.Keyboard.UP) || this.keyReleased(Phaser.Keyboard.SPACEBAR)) {
        this.game.input.activePointer.justReleased();
        return true;
     }
     return false;
    };

    jumpInputIsActive(duration) {
        let isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
        if (!isActive) {
            isActive = this.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, duration);
        }
        return isActive;
    };

    leftInputIsActive() {
        return (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.input.keyboard.isDown(Phaser.Keyboard.A));
    };

    rightInputIsActive() {
        return (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.input.keyboard.isDown(Phaser.Keyboard.D));
    };

    dashInputIsActive(duration) {
        return this.input.keyboard.downDuration(Phaser.Keyboard.C, duration);
    };

    retryInputIsActive() {
        return this.input.keyboard.isDown(Phaser.Keyboard.X);
    };

}