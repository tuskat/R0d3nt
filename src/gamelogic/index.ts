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
    public enemiesManager: EnemiesManager;
    public textManager: TextManager = new TextManager();
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
    updateCollision() {
        this.game.physics.arcade.collide(this.player.sprite, this.walls);
        this.game.physics.arcade.collide(this.player.weaponManager.getBullets(), this.walls);
        this.game.physics.arcade.collide(this.enemiesManager.getSprites(), this.walls);
        this.game.physics.arcade.collide(this.exit, this.walls);
    };
    updateOverlap() {
        this.game.physics.arcade.overlap(this.player.sprite, this.enemiesManager.getSprites(), this.playerIsAttacked, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.coins, this.takeCoin, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.walls, this.wallHandler, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.exit, this.nextStage, null, this);
        this.game.physics.arcade.overlap(this.player.weaponManager.getBullets(), this.enemiesManager.getSprites(), this.damageEnemies, null, this);
        this.game.physics.arcade.overlap(this.player.weaponManager.getBullets(), this.walls, this.killEntity, null, this.state);
    };
    updateEnemies() {
        this.enemiesManager.enemiesChase(this.player, this.walls);
    };

    takeCoin(player, coin, score) {
        coin.kill();
        this.score += 100;
        this.state.textManager.textUpdate(this.player.life, this.score);
    };
    damageEnemies(bullet, enemy) {
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
    killEntity(entity) {
        entity.kill();
    };
    // LOGIC BINDED TO LEVEL
    playerIsAttacked(player, enemy) {
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

    showEnemyDamage(enemy) {
        let damageColor = 0xc51b10;
        if (enemy.tint === damageColor)
            enemy.tint = 0xffffff;
        else {
            enemy.tint = damageColor;
            this.state.timer.add(250, this.showEnemyDamage, this, enemy);
        }
    };
    wallHandler() {
        this.player.addJump();
    };

    enemiesCount() {
        return this.enemiesManager.getEnemiesCount();
    };

    enemiesSprite() {
        return this.enemiesManager.getSprites();
    };

}