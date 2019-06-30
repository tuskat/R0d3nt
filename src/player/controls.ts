export default class PlayerControls {

    input: Phaser.Input = null;
    game: Phaser.Game = null;

    constructor(input, game) {
        this.input = input;
        this.game = game;
    }

    keyReleased(key) {
        let released = false;
        released = this.input.keyboard.upDuration(key);
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
        let isActive = false;
        isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
        if (this.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, duration)) {
            isActive = this.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, duration);
        }
        return isActive;
    };

    leftInputIsActive() {
        return this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    };

    rightInputIsActive() {
        return this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    };

    dashInputIsActive(duration) {
        return this.input.keyboard.downDuration(Phaser.Keyboard.C, duration);
    };

    retryInputIsActive() {
        return this.input.keyboard.isDown(Phaser.Keyboard.X);
    };

}