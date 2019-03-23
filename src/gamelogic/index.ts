import * as Assets from '../assets';
import Player from '../player/';
import Scene from '../states/scene';
import EnemiesManager from '../enemies';
import LightManager from '../levels/light/';
import TextManager from '../text/';

const enum State {
    IDLE = 1,
    CHASE,
    CONFUSED,
    ATTACKING,
    DEAD
};
const enum EnemyType {
    MOB = 1,
    BOSS
}
export default class GameLogic {

    public ground: Phaser.Group = null;
    public map: Phaser.Tilemap = null;
    public exit: Phaser.Group = null;
    public walls: Phaser.Group = null;
    public coins: Phaser.Group = null;
    public layer: Phaser.TilemapLayer = null;

    public game: Phaser.Game = null;
    public state: Scene = null;
    private enemiesManager: EnemiesManager;
    private textManager: TextManager = new TextManager();
    public light: LightManager = null;
    public score: number = 0;
    public player: Player;

    constructor(game, player, state) {
        this.game = game;
        this.state = state;
        this.player = player;
        this.score = 0;
    }

    // GAME LOGIC
    updateCollision = function () {
        this.game.physics.arcade.collide(this.player.sprite, this.walls);
        this.game.physics.arcade.collide(this.player.weaponManager.getBullets(), this.walls);
        this.game.physics.arcade.collide(this.enemiesManager.getSprites(), this.walls);
        this.game.physics.arcade.collide(this.exit, this.walls);
    };
    updateOverlap = function () {

        this.game.physics.arcade.overlap(this.player.sprite, this.enemiesManager.getSprites(), this.playerIsAttacked, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.coins, this.takeCoin, null, this.state);
        this.game.physics.arcade.overlap(this.player.sprite, this.walls, this.wallHandler, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.exit, this.nextStage, null, this);
        this.game.physics.arcade.overlap(this.player.weaponManager.getBullets(), this.enemiesManager.getSprites(), this.damageEnemies, null, this);
        this.game.physics.arcade.overlap(this.player.weaponManager.getBullets(), this.walls, this.killEntity, null, this.state);
    };
    updateEnemies = function () {
        this.enemiesManager.enemiesChase(this.player, this.walls);
    };

    takeCoin = function (player, coin, score) {
        coin.kill();
        this.levelManager.score += 100;
        this.textManager.textUpdate(this.player.life, this.levelManager.score);
    };
    damageEnemies = function (bullet, enemy) {
        if (enemy.status !== State.DEAD) {
            enemy.body.velocity.x += bullet.data.bulletManager.bulletSpeed / 2;
            enemy.life--;
            this.showEnemyDamage(enemy);
            bullet.kill();
            this.score += 25;
            this.state.textManager.textUpdate(this.player.life, this.score);
        }
        if (enemy.life <= 0) {
            enemy.state = State.DEAD;
            this.state.timer.add(800, this.killEntity, this, enemy);
        }
    };
    killEntity = function (entity) {
        entity.kill();
    };
    // LOGIC BINDED TO LEVEL
    playerIsAttacked = function (player, enemy) {
        if (enemy.state === State.DEAD) {
            return;
        }
        if (!this.player.invincibility) {
            if (enemy.animations.currentAnim.name === 'slash'
                && enemy.animations.currentAnim.currentFrame.index >= 19) {
                this.player.takeDamage(enemy);
                this.state.textManager.textUpdate(this.player.life, this.score);
            }
            if (this.player.life <= 0) {
                this.restart();
            }
        }
    };

    showEnemyDamage = function (enemy) {
        let damageColor = 0xc51b10;
        if (enemy.tint === damageColor)
            enemy.tint = 0xffffff;
        else {
            enemy.tint = damageColor;
            this.state.timer.add(250, this.showEnemyDamage, this, enemy);
        }
    };
    wallHandler = function () {
        this.player.addJump();
    };

    enemiesCount = function () {
        return this.enemiesManager.getEnemiesCount();
    };

    enemiesSprite = function () {
        return this.enemiesManager.getSprites();
    };

}