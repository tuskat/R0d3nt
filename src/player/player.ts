import Scene from '../states/gameScreenScene';
import WeaponManager from '../weapons/weaponManager';
import PlayerAnimation from './animations';
import PlayerControls from './controls';

const enum PlayerState {
  IDLE = 1,
  RUNNING,
  SHOOTING,
  JUMPING,
  DASHING,
  DEAD
};

export default class Player {
  public MAX_SPEED = 1000; // pixels/second
  public MAX_LIFE = 3;
  public SPEED = 350; // pixels/second/second
  public DRAG = 2500; // pixels/second
  public GRAVITY = 1150; // pixels/second/second
  public JUMP_SPEED = -450; // pixels/second (negative y is up)
  public jumps = 2;
  public dash = 1;
  public scale = 0.25;
  public sprite: Phaser.Sprite = null;
  public playerState: number = PlayerState.IDLE;
  public life = 0;
  public jumping = false;
  public shooting = false;
  public weaponManager: WeaponManager;
  public fireButton;
  public invincibility = false;
  public facingRight = true;
  public cooldownIcon;
  game: Phaser.Game = null;
  scene: Scene = null;
  controls: PlayerControls = null;
  animation: PlayerAnimation = null;

  constructor(controls, game, scene) {
    this.life = this.MAX_LIFE;
    this.game = game;
    this.scene = scene;
    this.controls = controls;
    this.jumping = false;
    this.playerState = PlayerState.IDLE;
    this.weaponManager = new WeaponManager(scene);
  }

  initPlayer() {
    if (this.sprite) {
      this.cooldownIcon.destroy(true);
      this.sprite.destroy(true);
    }
    this.sprite = this.game.add.sprite(this.game.width / 2, this.game.height - 64, 'player_ninja');
    this.cooldownIcon = this.game.add.sprite(-8, -128, 'ball');
    this.cooldownIcon.body.allowGravity = false;
    this.cooldownIcon.alpha = 0;
    this.cooldownIcon.tint = 0x008a95;
    this.sprite.addChild(this.cooldownIcon);
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = false;
    this.sprite.body.checkWorldBounds = true;
    this.sprite.body.setSize(80, 176, -16, 0);

    this.sprite.scale.y = this.scale;
    this.sprite.scale.x = this.scale;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 5);
    this.sprite.body.drag.setTo(this.DRAG, 0);
    this.shooting = false;

    this.game.physics.arcade.gravity.y = this.GRAVITY; // Put THIS somewhere else
    // this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0.5);

    this.animation = new PlayerAnimation(this.sprite, this);
    this.animation.initPlayerAnimation();
    this.weaponManager.initWeapon();
  };

  updatePlayer() {
    let onTheGround = this.sprite.body.touching.down;
    if (this.isDead() ||
      this.isOutBound()) {
      return;
    }
    else if (!this.isDashing()) {
      if (onTheGround) {
        this.isOnFloor();
      }
      this.isRunning();
      this.isShooting(onTheGround);
      this.isJumping(onTheGround);
    }
    this.game.camera.focusOnXY(this.sprite.x + 50, this.sprite.y);
  };

  die() {
    ;
    this.playerState = PlayerState.DEAD;
    this.life = 0;
    this.sprite.body.immovable = true;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.allowGravity = false;
    this.sprite.body.y = 0;
    this.scene.textManager.showRetryText(this.game);
    this.scene.soundManager.playSound('die');
    this.sprite.kill();
  };

  isDead() {
    return this.playerState === PlayerState.DEAD;
  };

  isOutBound() {
    if (this.sprite.body.y > this.game.world.height + 128) {
      this.die();
      return true;
    }
    return false;
  };

  jump() {
    this.sprite.body.velocity.y = this.JUMP_SPEED;
    this.animation.playAnimation('jump', 10, false);
    this.playerState = PlayerState.JUMPING;
  };

  isJumping(onTheGround) {
    if (this.jumps > 0) {
      if (!onTheGround && this.controls.jumpInputIsActive(75)) {
        this.jumping = true;
        this.jump();
      }
      else if (this.controls.jumpInputIsActive(125)) {
        this.jumping = true;
        this.jump();
      }
    }
    if (this.jumping && this.controls.upInputReleased()) {
      this.jumps--;
      this.jumping = false;
    }
  };

  isOnFloor() {
    this.jumps = 2;
    this.jumping = false;
    let previousState = this.playerState;
    if (this.controls.leftInputIsActive() || this.controls.rightInputIsActive()) {
      this.playerState = PlayerState.RUNNING;
      if (previousState !== PlayerState.SHOOTING) {
        this.animation.playAnimation('run');
      }
    } else {
      if (this.playerState !== PlayerState.SHOOTING &&
        this.playerState !== PlayerState.DASHING) {
        this.playerState = PlayerState.IDLE;
        this.animation.playAnimation('idle', 4, true);
      }
    }
  };

  isRunning() {
    if (this.controls.leftInputIsActive()) {
      this.sprite.scale.x = -this.scale;
      this.facingRight = false;
      this.sprite.body.velocity.x = -this.SPEED;
    }
    else if (this.controls.rightInputIsActive()) {
      this.sprite.scale.x = this.scale;
      this.facingRight = true;
      this.sprite.body.velocity.x = this.SPEED;
    }
  };

  isShooting(onTheGround) {
    let lastState = this.playerState;
    if (this.weaponManager.isShooting()) {
      this.playerState = PlayerState.SHOOTING;
      if (this.facingRight === true) {
        this.weaponManager.shootRight(this.sprite);
      }
      else {
        this.weaponManager.shootLeft(this.sprite);
      }
      let shot = this.weaponManager.fireAction();
      if (shot === true) {
        if (onTheGround === true) {
          if (lastState === PlayerState.RUNNING)
            this.animation.playAnimation('runshoot', 30, true);
          else
            this.animation.playAnimation('shoot', 25, false);
        }
        else
          this.animation.playAnimation('jumpshoot', 25, false);
      }
    } else {
      this.playerState = PlayerState.RUNNING;
    }
  };

  isDashing() {
    if (this.dash > 0 && (this.controls.dashInputIsActive())) {
      this.playerState = PlayerState.DASHING;
      this.sprite.body.velocity.x = this.MAX_SPEED * (this.sprite.scale.x * 4);
      // this.sprite.body.gravity.y = -1150;

      this.animation.playAnimation('dash', 25, false);
      this.scene.soundManager.playSound('dash');
      this.dash--;
      this.scene.timer.add(375, this.endDash, this);
    }
    return this.playerState === PlayerState.DASHING;
  };

  restoreDash() {
    this.cooldownIcon.alpha = 0;
    this.dash = 1;
  };

  endDash() {
    if (!this.isDead()) {
      this.cooldownIcon.alpha = 1;
      this.playerState = PlayerState.IDLE;
      // this.sprite.body.gravity.y = 0;
      this.scene.timer.add(500, this.restoreDash, this);
    }
  };

  takeBullet(playerSprite = this.sprite, bullet) {
    this.die();
    bullet.kill();
  };

  takeDamage(playerSprite = this.sprite, threatSprite) {
    if (!this.invincibility) {
      let facingRight = (threatSprite.x > playerSprite.body.x) || (threatSprite.body.x > playerSprite.body.x);
      this.life -= 1;
      this.invincibility = true;
      this.sprite.body.velocity.x = facingRight ? -500 : 500;
      this.scene.timer.add(1000, this.updateInvincibility, this);
      this.scene.timer.add(250, this.showDamage, this);
      this.scene.soundManager.playSound('hit');
      this.scene.textManager.textUpdate(this.life, this.scene.currentScore());
      if (this.life <= 0) {
        this.die();
      }
    }
  };

  showDamage() {
    let damageColor = 0xc51b10;
    if (this.sprite.tint === damageColor)
      this.sprite.tint = 0xffffff;
    else
      this.sprite.tint = damageColor;
    if (this.invincibility === true)
      this.scene.timer.add(250, this.showDamage, this);
  };

  updateInvincibility() {
    this.invincibility = false;
  };
}