import EnemyAnimation from './animations';
import EnemySprite from './sprite';
import Scene from '../states/gameScreenScene';

const enum State {
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
    public MAX_SPEED = 750; // pixels/second
    public MAX_LIFE = 1;
    public ACCELERATION = 300; // pixels/second/second
    public DRAG = 400; // pixels/second
    public GRAVITY = 30; // pixels/second/second
    public JUMP_SPEED = -700; // pixels/second (negative y is up)
    private tilesize = 32;
    public scale = 0.25;
    public enemyGroup: Phaser.Group = null;
    public spawnDoor: Phaser.Group = null;
    public game: Phaser.Game = null;
    public scene: Scene = null;
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;
        this.spawnDoor = this.game.add.group();
        this.enemyGroup = this.game.add.group();
    }
    initEnemySpawn(x, y, nbr, tilesize) {
        this.tilesize = tilesize;
        let spawn = <EnemySprite> this.game.add.sprite(this.tilesize * x, (this.tilesize * y) - 10 , 'rat_spawn');
        this.spawnDoor.add(spawn);
        spawn.body.immovable = true;
        spawn.body.allowGravity = false;
        for (let i = 0; i < nbr; i++) {
            let spawnRate = (100 * i) + this.game.rnd.integerInRange(2000, 5000);
            this.scene.timer.add(spawnRate, this.initSlasher, this, x, y + 1 , tilesize);
        }
    };

    initSlasher(x, y, tilesize) {
        this.tilesize = tilesize;

        let enemy = <EnemySprite> this.game.add.sprite(this.tilesize * x, (this.tilesize * y) - 64, 'enemy_ninja');
        enemy.scale.x = this.scale;
        enemy.scale.y = this.scale;
        enemy.body.collideWorldBounds = false;

        this.enemyGroup.add(enemy);
        enemy.body.gravity.y = this.GRAVITY;

        enemy.body.enableBody = true;
        enemy.body.checkCollision.up = false;
        enemy.body.setSize(112, 176, -16, 0);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.wandering = false;
        enemy.speed = this.game.rnd.integerInRange(-50, 50);
        enemy.animation = new EnemyAnimation(enemy, this.scene);
        enemy.animation.initAnimation();
        enemy.body.allowGravity = true;
        enemy.life = this.MAX_LIFE * 3;
        enemy.sight = { x: 500, y: 100 };
        enemy.type = EnemyType.BOSS;
        enemy.facingRight = false;
        enemy.state = State.IDLE;
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    };


    public getEnemiesCount() {
        return this.enemyGroup.countLiving().toString();
    };
    public getSprites() {
        return this.enemyGroup;
    };
}