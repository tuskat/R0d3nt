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
    this.sprite.animations.add('idle', [Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle1,
    Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle2,
    Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle3,
    Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle4]);
  };

  initRun() {
    let anim = this.sprite.animations.add('run', [Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun1,
    Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun2,
    Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun3,
    Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun4,
    Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun5,
    Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun6]);

    anim.enableUpdate = true;
    anim.onUpdate.add(this.runningSound, this);
  };

  initSlash() {
    let anim = this.sprite.animations.add('slash', [Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash1,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash2,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash3,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash4,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash5,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash6,
    Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash7,
    ]);
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

  setCollision(width, height = 178) {
    this.sprite.body.setSize(width, height, 0, 0);
  };

  doneSlashing() {
    this.playAnimation('idle', 4, true);
  };

  slashing(anim, frame) {
    if (frame.index >= 19) {
      this.scene.soundManager.playSound('slash');
      this.setCollision(frame.sourceSizeW);
    }
  };
  runningSound(anim, frame) {
    let playSound = (frame.index === 12);
    if (playSound) {
      this.scene.soundManager.playSound('enemy-run');
    }
  };
}