export default class SoundManager {
  game;
  //
  sounds = [];
  musics = [];
  current_music;
  isplaying = false;
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
  let music = [
    'baws_sirens',
    'baws_waves',
    'baws_imaginary_funerals'
  ];
    audio.forEach(sound => {
      this.sounds[sound] = this.game.add.audio(sound);
    });
    music.forEach(sound => {
      this.musics[sound] = this.game.add.audio(sound);
    });
    for (let key in this.sounds) {
      this.sounds[key].volume = 0.5;
    }
    for (let key in this.musics) {
      this.musics[key].volume = 0.35;
    }
  };
  playSound(sfx) {
    this.sounds[sfx].play();
  };
  playMusic(title) {
    if (this.isplaying) {
      return;
    }
    if (this.current_music) {
      this.current_music.stop();
    }
    this.current_music = this.musics[title];
    this.current_music.loop = true;
    this.current_music.play();
    this.isplaying = true;
  }
}