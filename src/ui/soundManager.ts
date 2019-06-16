export default class SoundManager {
  game;
  //
  sounds = [];
  music;
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
      'powerup',
      'hit',
      'run',
      'slash',
      'shoot',
      'pause_in',
      'pause_out'
    ];
    audio.forEach(sound => {
      this.sounds[sound] = this.game.add.audio(sound);
    });
    for (let key in this.sounds) {
      this.sounds[key].volume = 0.5;
    }
    this.music = this.game.add.audio('baws_sirens');
    this.music.loop = true;
    this.music.play();
  };
  playSound(sfx) {
    this.sounds[sfx].play();
  };
  playMusic(title) {
    this.music.stop();
    this.music = this.game.add.audio(title);
    this.music.loop = true;
    this.music.play();
  }
}