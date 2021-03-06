import * as Assets from '../assets';
import Scene from '../states/gameScreenScene';

export default class DasherAnimation {
  public sprite: Phaser.Sprite = null;
  public scene: Scene;
  private lastAnimation: string = null;
  constructor(sprite, scene) {
    this.sprite = sprite;
    this.scene = scene;
  }
  initIdle() {
    this.sprite.animations.add('idle', [Assets.Atlases.AtlasesDasherNinja.Frames.Idle1,
    Assets.Atlases.AtlasesDasherNinja.Frames.Idle2,
    Assets.Atlases.AtlasesDasherNinja.Frames.Idle3]);
  }

  initRun() {
    let anim = this.sprite.animations.add('run', [Assets.Atlases.AtlasesDasherNinja.Frames.Run1,
    Assets.Atlases.AtlasesDasherNinja.Frames.Run2,
    Assets.Atlases.AtlasesDasherNinja.Frames.Run3,
    Assets.Atlases.AtlasesDasherNinja.Frames.Run4,
    Assets.Atlases.AtlasesDasherNinja.Frames.Run5]);

    anim.enableUpdate = true;
    anim.onUpdate.add(this.runningSound, this);
  }

  initSlash() {
    let anim = this.sprite.animations.add('slash', [Assets.Atlases.AtlasesDasherNinja.Frames.Slash1,
    Assets.Atlases.AtlasesDasherNinja.Frames.Slash2,
    Assets.Atlases.AtlasesDasherNinja.Frames.Slash3,
    Assets.Atlases.AtlasesDasherNinja.Frames.Slash4,
    Assets.Atlases.AtlasesDasherNinja.Frames.Slash5
    ]);
    anim.enableUpdate = true;
    anim.onUpdate.add(this.slashing, this);
    anim.onComplete.add(this.doneSlashing, this);
  }

  initAnimation() {
    this.initIdle();
    this.initRun();
    this.initSlash();

    this.sprite.animations.play('idle', 4, true);
  }

  playAnimation(animation, framerate = 30, loop = true, immovable = false) {
    if (animation !== this.lastAnimation) {
      this.sprite.animations.play(animation, framerate, loop);
      this.lastAnimation = animation;
    }
    this.setCollision();
  }

  setCollision(width = 88, height = 88, offsetY = 0) {
    let offsetX = 4;
    this.sprite.body.setSize(width, height, offsetX, offsetY);
  }

  doneSlashing() {
    this.playAnimation('idle', 4, true);
  }

  slashing(anim, frame) {
    if (frame.name === Assets.Atlases.AtlasesDasherNinja.Frames.Slash3) {
      this.scene.soundManager.playSound('slash');
    }
  }
  runningSound(anim, frame) {
    let playSound = (frame.name === Assets.Atlases.AtlasesDasherNinja.Frames.Run3);
    if (playSound) {
      this.scene.soundManager.playSound('enemy-run');
    }
  }
}