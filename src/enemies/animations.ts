import * as Assets from '../assets';
import Scene from '../states/gameScreenScene';

export default class EnemyAnimation {
  public sprite: Phaser.Sprite = null;
  public scene: Scene;
  private lastAnimation: string = null;
  constructor(sprite, scene) {
    this.sprite = sprite;
    this.scene = scene
  }
  initIdle() {
    this.sprite.animations.add('idle', [Assets.Atlases.AtlasesSlasherNinja.Frames.Idle00,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Idle01,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Idle02,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Idle03]);
  };

  initRun() {
    let anim = this.sprite.animations.add('run', [Assets.Atlases.AtlasesSlasherNinja.Frames.Run00,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Run01,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Run02,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Run03,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Run04,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Run05]);

    anim.enableUpdate = true;
    anim.onUpdate.add(this.runningSound, this);
  };

  initSlash() {
    let anim = this.sprite.animations.add('slash', [Assets.Atlases.AtlasesSlasherNinja.Frames.Slash00,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Slash01,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Slash02,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Slash03,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Slash04,
    Assets.Atlases.AtlasesSlasherNinja.Frames.Slash05]);
    anim.enableUpdate = true;
    anim.onUpdate.add(this.slashing, this);
    anim.onComplete.add(this.doneSlashing, this);
  };

  initAnimation() {
    this.initIdle();
    this.initRun();
    this.initSlash();

    this.sprite.animations.play('idle', 4, true);
  };

  playAnimation(animation, framerate = 30, loop = true, immovable = false) {
    if (animation !== this.lastAnimation) {
      this.sprite.animations.play(animation, framerate, loop);
      this.lastAnimation = animation;
      let frame = this.sprite.animations.currentFrame;
      this.setCollision(frame.sourceSizeW);
      if (immovable) {
        this.sprite.body.checkCollision.left = false;
        this.sprite.body.checkCollision.right = false;
      } else {
        this.sprite.body.checkCollision.left = true;
        this.sprite.body.checkCollision.right = true;
      }
    }
  };

  setCollision(width, height = 86) {
    this.sprite.body.setSize(width, height, 0, 0);
  };

  doneSlashing() {
    this.playAnimation('idle', 4, true);
  };

  slashing(anim, frame) {
    if (frame.name === Assets.Atlases.AtlasesSlasherNinja.Frames.Slash02) {
      this.scene.soundManager.playSound('slash');
      this.setCollision(frame.sourceSizeW);
    }
  };
  runningSound(anim, frame) {
    let playSound = (frame.name === Assets.Atlases.AtlasesSlasherNinja.Frames.Run02);
    if (playSound) {
      this.scene.soundManager.playSound('enemy-run');
    }
  };
}