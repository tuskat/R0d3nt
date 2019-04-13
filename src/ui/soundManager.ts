export default class SoundManager {
    game;
    //
    sounds = [];
    constructor(game) {
        this.game = game;
    }
    initSounds() {
        let audio = [
            'clear',
            'die',
            'dash',
            'explosion',
            'enemy-run',
            'enemy-hit',
            'jump',
            'hit',
            'run',
            'slash',
            'shoot'
        ]
        audio.forEach(sound => {
            this.sounds[sound] = this.game.add.audio(sound);
        });
        for (let key in this.sounds) {    
            this.sounds[key].volume = 0.5; 
        }
    }
    playSound(sfx) {
        this.sounds[sfx].play();
    }
}