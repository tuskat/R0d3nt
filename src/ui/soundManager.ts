export default class SoundManager {
    game;
    //
    sounds = [];
    constructor(game) {
        this.game = game;
    }
    initSounds() {
        this.sounds['run'] = this.game.add.audio('run');
    }
    playSound(sfx) {
        this.sounds[sfx].play();
    }
}