
import LevelCreator from './levelCreator';

const enum State {
    IDLE = 1,
    CHASE,
    CONFUSED,
    ATTACKING,
    DEAD
};

const enum EnemyType {
    SLASHER = 1,
    REAPER,
    SHOOTER
};

export default class LevelManager extends LevelCreator  {
    // Update
    updateCollision() {
        this.game.physics.arcade.collide(this.player.sprite, this.walls);
        this.game.physics.arcade.collide(this.enemiesSprite());
        this.game.physics.arcade.collide(this.enemiesSprite(), this.walls);
        this.game.physics.arcade.collide(this.exit, this.walls);
        this.game.physics.arcade.collide(this.player.weaponManager.getPistolBullets(), this.walls);
    };
    updateOverlap() {
        this.game.physics.arcade.overlap(this.player.sprite, this.enemiesManager.getSprites(), this.playerIsAttacked, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.coins, this.takeCoin, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.exit, this.nextStage, null, this);
        this.game.physics.arcade.overlap(this.player.weaponManager.getPistolBullets(), this.walls, this.killEntity, null, this.scene);
        this.enemiesManager.enemiesOverlap(this.player);
    };
    updateEnemies() {
        this.enemiesManager.update(this.player, this.walls);
    };
    updateDeadMenu() {
        if (this.player.controls.retryInputIsActive()) {
            this.restart();
        }
    }

    update() {
        this.updateOverlap();
        this.updateCollision();
        this.updateEnemies();
        if (this.player.isDead()) {
            this.updateDeadMenu();
            return;
        }
        // this.light.updateLight();
    }

    // Should Absolutely be not here
    takeCoin(player, coin, score) {
        coin.kill();
        this.scene.score += 100;
        this.player.weaponManager.setGun(this.game.rnd.integerInRange(1,2));
        this.scene.textManager.textUpdate(null, this.scene.score);
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
                this.scene.textManager.textUpdate(this.player.life, this.scene.score);
            }
            if (this.player.life <= 0) {
                this.player.die();
            }
        }
    };

    killEntity(entity) {
        entity.kill();
    };

    enemiesCount() {
        return this.enemiesManager.getEnemiesCount();
    };

    enemiesSprite() {
        return this.enemiesManager.getSprites();
    };

    nextStage(player, exit) {
        let enemiesNbr = + this.enemiesCount();
        if (enemiesNbr === 0) {
            this.scene.level = this.scene.level + 1;
            this.game.state.start('scene');
        }
    };
    restart() {
        this.player.life = 3;
        this.player.invincibility = false;
        this.game.state.start('scene');
    };
}
