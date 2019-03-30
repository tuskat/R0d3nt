import Scene from '../states/gameScreenScene';
import WeaponManager from '../weapons/weaponManager';
import PlayerAnimation from './animations';
import PlayerControls from './controls';
import { on } from 'cluster';

const enum PlayerStatus {
    IDLE = 1,
    RUNNING,
    SHOOTING,
    JUMPING,
    DEFAULT,
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
    public scale = 0.25;
    public sprite: Phaser.Sprite = null;
    public playerState: number = PlayerStatus.IDLE;
    public life = 0;
    public jumping = false;
    public shooting = false;
    public weaponManager: WeaponManager;
    public fireButton;
    public invincibility = false;
    public facingRight = true;
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
        this.playerState = PlayerStatus.IDLE;
        this.weaponManager = new WeaponManager(scene);
    }
    initPlayer() {
        this.sprite = this.game.add.sprite(this.game.width / 2, this.game.height - 64, 'player_ninja');
        this.sprite.body.setSize(80, 176, -16, 0);
        this.animation = new PlayerAnimation(this.sprite, this);
        this.animation.initPlayerAnimation();

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = false;
        this.sprite.body.checkWorldBounds = true;

        this.sprite.scale.y = this.scale;
        this.sprite.scale.x = this.scale;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 5);
        this.sprite.body.drag.setTo(this.DRAG, 0);
        this.shooting = false;

        this.game.physics.arcade.gravity.y = this.GRAVITY;
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.weaponManager.initWeapon();
    };
    updatePlayer() {
        let onTheGround = this.sprite.body.touching.down;
        if (this.isDead() || this.isOutBound()) {
            return;
        }

        if (onTheGround) {
            this.isOnFloor();
        }
        this.isRunning();
        this.isShooting(onTheGround);
        this.isJumping(onTheGround);

    };
    die() {
        this.playerState = PlayerStatus.DEAD;
        this.life = 0;
        this.sprite.body.immovable = true;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.allowGravity = false;
        this.sprite.body.y = 0;
        this.scene.textManager.showRetryText(this.game);
        this.sprite.kill();
    };
    isDead() {
        return this.playerState === PlayerStatus.DEAD;
    };
    isOutBound() {
        if (this.sprite.body.y > this.game.world.height) {
            this.die();
            return true;
        }
        return false;
    };
    jump() {
        this.sprite.body.velocity.y = this.JUMP_SPEED;
        this.animation.playAnimation('jump', 3);
        this.playerState = PlayerStatus.JUMPING;
    };
    isJumping(onTheGround) {
        if (this.jumps > 0) {
            if (!onTheGround && this.controls.upInputIsActive(50)) {
                    this.jumping = false;
                    this.jump();
                }
            else if (this.controls.upInputIsActive(150)) {
                this.jumping = true;
                this.jump();
            }
        }
        if (this.jumping && this.controls.upInputReleased()) {
            this.jumping = false;
            this.jumps--;
        }
    };
    isOnFloor() {
        this.jumps = 2;
        this.jumping = false;
        let previousState = this.playerState;
        if (this.controls.leftInputIsActive() || this.controls.rightInputIsActive()) {
            this.playerState = PlayerStatus.RUNNING;
            if (previousState !== PlayerStatus.SHOOTING) {
                this.animation.playAnimation('run');
            }
        } else {
            if (this.playerState !== PlayerStatus.SHOOTING) {
                this.playerState = PlayerStatus.IDLE;
                this.animation.playAnimation('idle', 4);
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
        if (this.weaponManager.isShooting()) {
            let weapon = this.weaponManager.pistol;
            let shot = this.weaponManager.fireAction(weapon);
            this.shoot(onTheGround, shot, weapon);
        } else if (this.weaponManager.isChargedShotting()) {
            let weapon = this.weaponManager.cannon;
            let shot = this.weaponManager.fireAction(weapon);
            this.shoot(onTheGround, shot, weapon);
        }
         else {
            this.playerState = PlayerStatus.RUNNING;
        }
    };
    shoot(onTheGround, shot, weapon) {
        let lastState = this.playerState;
        this.playerState = PlayerStatus.SHOOTING;
        if (this.facingRight === true) {
            this.weaponManager.shootRight(this.sprite, weapon);
        }
        else {
            this.weaponManager.shootLeft(this.sprite, weapon);
        }
        if (shot === true) {
            if (onTheGround === true) {
                if (lastState === PlayerStatus.RUNNING)
                    this.animation.playAnimation('runshoot', 30, true);
                else
                    this.animation.playAnimation('shoot', 30, false);
            }
            else
                this.animation.playAnimation('jumpshoot', 30, false);
        }
    };
    takeDamage(enemy) {
        this.life -= 1;
        this.invincibility = true;
        this.sprite.body.velocity.x = enemy.facingRight ? 1500 : -1500;
        this.scene.timer.add(1000, this.updateInvincibility, this);
        this.scene.timer.add(250, this.showDamage, this);
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
    addJump() {
        if (this.jumps === 0 && this.controls.upInputIsActive(50)) {
            this.jumps = 1;
        }
    };
}

// Always use isRunning in the end...
// switch (this.playerState) {
//     case PlayerStatus.IDLE: {
//         this.isRunning(onTheGround);
//         break;
//     }
//     case PlayerStatus.RUNNING: {
//         this.isRunning(onTheGround);
//         break;
//     }
//     case PlayerStatus.JUMPING: {
//         this.isRunning(onTheGround);
//         break;
//     }
//     case PlayerStatus.SHOOTING: {
//         this.isRunning(onTheGround);
//         break;
//     }
//     default: {
//         this.isRunning(onTheGround);
//         break;
//     }
// }