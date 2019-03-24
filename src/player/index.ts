import WeaponManager from '../weapons';
import PlayerAnimation from './animations';
import PlayerControls from './controls';

const enum PlayerStatus {
    IDLE = 1,
    RUNNING,
    SHOOTING,
    JUMPING,
    DEFAULT
};

export default class Player {
    public MAX_SPEED = 400; // pixels/second
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

    public weaponManager: WeaponManager;
    public fireButton;
    public invincibility = false;
    public facingRight = true;
    game: Phaser.Game = null;
    input: Phaser.Input = null;
    state: Phaser.State = null;
    controls: PlayerControls = null;
    animation: PlayerAnimation = null;

    constructor(input, game, state) {
        this.life = this.MAX_LIFE;
        this.game = game;
        this.input = input;
        this.state = state;
        this.jumping = false;
        this.playerState = PlayerStatus.IDLE;
        this.weaponManager = new WeaponManager(state);
    }
    initPlayer() {
        this.sprite = this.game.add.sprite(this.game.width / 2, this.game.height - 64, 'player_ninja');
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.stopVelocityOnCollide = false;
        this.setDefaultCollision();

        this.sprite.scale.y = this.scale;
        this.sprite.scale.x = this.scale;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 5);
        this.sprite.body.drag.setTo(this.DRAG, 0);
        this.sprite.shooting = false;

        this.game.physics.arcade.gravity.y = this.GRAVITY;
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.animation = new PlayerAnimation(this.sprite);
        this.controls = new PlayerControls(this.input, this.game);
        this.animation.initPlayerAnimation();

        this.weaponManager.initWeapon();
    };
    playerControl() {
        let onTheGround = this.sprite.body.touching.down;
        this.isRunning();
        this.isShooting(onTheGround);
        this.isJumping(onTheGround);
        if (onTheGround) {
            this.isOnFloor();
        }
    };
    updateOverlap() {

    }
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
        let lastState = this.playerState;
        if (this.weaponManager.isShooting()) {
            this.playerState = PlayerStatus.SHOOTING;
            if (this.facingRight === true) {
                this.weaponManager.shootRight(this.sprite);
            }
            else {
                this.weaponManager.shootLeft(this.sprite);
            }
            let shot = this.weaponManager.fireAction();
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
        } else {
            this.playerState = PlayerStatus.RUNNING;
        }
    };
    takeDamage(enemy) {
        this.life -= 1;
        this.invincibility = true;
        this.sprite.body.velocity.x = enemy.facingRight ? 1500 : -1500;
        this.state.timer.add(1000, this.updateInvincibility, this);
        this.state.timer.add(250, this.showDamage, this);
    };
    showDamage() {
        let damageColor = 0xc51b10;
        if (this.sprite.tint === damageColor)
            this.sprite.tint = 0xffffff;
        else
            this.sprite.tint = damageColor;
        if (this.invincibility === true)
            this.state.timer.add(250, this.showDamage, this);
    };
    updateInvincibility() {
        this.invincibility = false;
    };
    addJump() {
        if (this.jumps === 0 && this.controls.upInputIsActive(50)) {
            this.jumps = 1;
        }
    };
    setDefaultCollision() {
        this.sprite.body.setSize(80, 176, -16, 0);
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