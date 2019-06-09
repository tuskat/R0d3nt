import EnemyAnimation from './animations';
import DasherAnimation from './dasher_animations';
import EnemySprite from './sprite';
import Scene from '../states/gameScreenScene';

const enum State {
    IDLE = 1,
    CHASE,
    CONFUSED,
    DEAD
};
const enum EnemyType {
    SLASHER = 1,
    DASHER,
    SHOOTER
  };
  
export default class EnemiesFactory {
    public MAX_SPEED = 750; // pixels/second
    public MAX_LIFE = 3;
    public ACCELERATION = 300; // pixels/second/second
    public DRAG = 400; // pixels/second
    public GRAVITY = 30; // pixels/second/second
    public JUMP_SPEED = -700; // pixels/second (negative y is up)
    private tilesize = 32;
    public scale = 0.5;
    public enemyGroup: Phaser.Group = null;
    public spawnDoor: Phaser.Group = null;
    public game: Phaser.Game = null;
    public scene: Scene = null;
    public attackList = [];
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;
        this.spawnDoor = this.game.add.group();
        this.enemyGroup = this.game.add.group();
        this.initAttack();
    }
    stopDash = function (enemy) {
        if (this.scene.levelManager.player.sprite.x > enemy.body.x) {
            enemy.scale.x = this.scale;
        } else {
            enemy.scale.x = -this.scale;
        }
        enemy.body.velocity.x = 0;
    }
    recharge = function (enemy) {
        enemy.onCooldown = false;
    };
    dashAttack(enemy) {
        enemy.body.velocity.x = this.MAX_SPEED * enemy.scale.x;
        enemy.body.velocity.y = 0;
        enemy.animation.playAnimation('slash', 12, false, true);
        this.scene.timer.add(500, this.stopDash, this, enemy);
        this.scene.timer.add(1000, this.recharge, this, enemy);
        enemy.onCooldown = true;
    };
    slashAttack(enemy) { 
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        enemy.animation.playAnimation('slash', 24, false, true);
        this.scene.timer.add(1000, this.recharge, this, enemy);
        
        enemy.onCooldown = true;
    };
    initAttack() {
        this.attackList[EnemyType.SLASHER] = this.slashAttack.bind(this);
        this.attackList[EnemyType.DASHER] = this.dashAttack.bind(this);
    };
    initEnemySpawn(x, y, nbr, tilesize) {
        this.tilesize = tilesize;
        let spawn = <EnemySprite> this.game.add.sprite(this.tilesize * x, (this.tilesize * y) - 10 , 'rat_spawn');
        this.spawnDoor.add(spawn);
        spawn.body.immovable = true;
        spawn.body.allowGravity = false;
        for (let i = 0; i < nbr; i++) {
            let spawnRate = (100 * i) + this.game.rnd.integerInRange(200, 500);
            this.scene.timer.add(spawnRate, this.initSlasher, this, x, y, tilesize);
        }
    };

    initSlasher(x, y, tilesize) {
        this.tilesize = tilesize;

        let enemy = <EnemySprite> this.game.add.sprite((this.tilesize * x) + 16, (this.tilesize * y)  + 20, 'slasher_ninja');
        enemy.scale.x = this.scale;
        enemy.scale.y = this.scale;
        enemy.body.collideWorldBounds = false;

        this.enemyGroup.add(enemy);
        enemy.body.gravity.y = this.GRAVITY;

        enemy.body.enableBody = true;
        enemy.body.checkCollision.up = false;
        enemy.body.setSize(112, 88, 0, 0);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.wandering = false;
        enemy.speed = this.game.rnd.integerInRange(-50, 50);
        enemy.animation = new EnemyAnimation(enemy, this.scene);
        enemy.animation.initAnimation();
        enemy.body.allowGravity = true;
        enemy.life = this.MAX_LIFE;
        enemy.sight = { x: 500, y: 100 };
        enemy.type = EnemyType.SLASHER;
        enemy.facingRight = false;
        enemy.state = State.IDLE;
        enemy.attackDistance = 30;
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    };
    initDasher(x, y, tilesize) {
        this.tilesize = tilesize;

        let enemy = <EnemySprite> this.game.add.sprite((this.tilesize * x) + 20, (this.tilesize * y), 'dasher_ninja');
        enemy.scale.x = this.scale;
        enemy.scale.y = this.scale;
        enemy.body.collideWorldBounds = false;

        this.enemyGroup.add(enemy);
        enemy.body.gravity.y = this.GRAVITY;

        enemy.body.enableBody = true;
        enemy.body.checkCollision.up = false;
        enemy.body.setSize(112, 88, 0, 0);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.wandering = false;
        enemy.speed = this.game.rnd.integerInRange(-50, 50);
        enemy.animation = new DasherAnimation(enemy, this.scene);
        enemy.animation.initAnimation();
        enemy.body.allowGravity = true;
        enemy.life = this.MAX_LIFE * 3;
        enemy.sight = { x: 500, y: 100 };
        enemy.type = EnemyType.DASHER;
        enemy.facingRight = false;
        enemy.state = State.IDLE;
        enemy.attackDistance = 90;
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    };

    public getEnemiesCount() {
        return this.enemyGroup.countLiving().toString();
    };
    public getSprites() {
        return this.enemyGroup;
    };
}