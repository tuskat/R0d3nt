import EnemyAnimation from './animations';

const enum Status {
    IDLE = 1,
    CHASE,
    CONFUSED,
    DEAD
};
const enum EnemyType {
    MOB = 1,
    BOSS
}
export default class EnemiesFactory {
    public MAX_SPEED = 500; // pixels/second
    public MAX_LIFE = 3;
    public ACCELERATION = 150; // pixels/second/second
    public DRAG = 400; // pixels/second
    public GRAVITY = 30; // pixels/second/second
    public JUMP_SPEED = -700; // pixels/second (negative y is up)
    private tilesize = 32;
    public scale = 0.25;
    public sprites: Phaser.Group = null;
    public spawns: Phaser.Group = null;
    public game: Phaser.Game = null;
    state: Phaser.State = null;
    constructor(game, state) {
        this.game = game;
        this.state = state;
        this.sprites = this.game.add.group();
        this.spawns = this.game.add.group();
    }
    initEnemySpawn = function (x, y, nbr, tilesize) {
        this.tilesize = tilesize;
        let spawn = this.game.add.sprite(this.tilesize * x, (this.tilesize * y) + 20, 'my_spawn');
        this.spawns.add(spawn);
        spawn.body.immovable = true;
        spawn.body.allowGravity = false;
        for (let i = 0; i < nbr; i++) {
            let pos = { x: x, y: y };
            let spawnRate = (100 * i) + this.game.rnd.integerInRange(2000, 5000);
            this.state.timer.add(spawnRate, this.initEnemy, this, pos);
        }
    };
    initEnemy = function (pos) {
        let enemy = this.game.add.sprite(this.tilesize * pos.x, this.tilesize * pos.y, 'cyclops');
        this.sprites.add(enemy);
        enemy.body.gravity.y = this.GRAVITY;
        enemy.body.collideWorldBounds = true;
        enemy.body.enableBody = true;
        enemy.body.setSize(20, 32, 6, 0);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.wandering = false;
        // enemy.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 5);
        //  enemy.body.drag.setTo(this.DRAG, 0);
        enemy.body.allowGravity = true;
        enemy.life = this.MAX_LIFE;
        enemy.type = EnemyType.MOB;
        enemy.sight = { x: 400, y: 100 };
        enemy.facingRight = false;
        enemy.status = Status.IDLE;
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    };

    initBoss = function (x, y, tilesize) {
        this.tilesize = tilesize;

        let enemy = this.game.add.sprite(this.tilesize * x, (this.tilesize * y) - 64, 'enemy_ninja');
        enemy.scale.x = this.scale;
        enemy.scale.y = this.scale;
        enemy.body.collideWorldBounds = true;


        this.sprites.add(enemy);
        enemy.body.gravity.y = this.GRAVITY;

        enemy.body.enableBody = true;
        enemy.body.setSize(112, 176, -16, 0);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.wandering = false;
        enemy.animation = new EnemyAnimation(enemy);
        enemy.animation.initAnimation();
        // enemy.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 5);
        // enemy.body.drag.setTo(this.DRAG, 0);
        enemy.body.allowGravity = true;
        enemy.life = this.MAX_LIFE * 10;
        enemy.sight = { x: 400, y: 100 };
        enemy.type = EnemyType.BOSS;
        enemy.facingRight = false;
        enemy.status = Status.IDLE;
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    };


    public getEnemiesCount = function () {
        return this.sprites.countLiving().toString();
    };
    public getSprites = function () {
        return this.sprites;
    };
}