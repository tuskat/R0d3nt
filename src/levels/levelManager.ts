
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

export default class LevelManager extends LevelCreator {
  // Update
  updateCollision() {
    this.game.physics.arcade.collide(this.player.sprite, this.walls);
    this.game.physics.arcade.collide(this.player.sprite, this.trap);
    this.game.physics.arcade.collide(this.enemiesSprite());
    this.game.physics.arcade.collide(this.enemiesSprite(), this.walls);
    this.game.physics.arcade.collide(this.enemiesSprite(), this.trap);
    this.game.physics.arcade.collide(this.exit, this.walls);
  };
  updateOverlap() {
    this.game.physics.arcade.overlap(this.player.sprite, this.coins, this.takeCoin, null, this);
    this.game.physics.arcade.overlap(this.player.sprite, this.exit, this.nextStage, null, this);
    this.game.physics.arcade.overlap(this.player.sprite, this.interuptor, this.activateTrap, null, this);
    this.game.physics.arcade.overlap(this.enemiesManager.getSprites(), this.interuptor, this.activateTrap, null, this);
    this.game.physics.arcade.overlap(this.player.weaponManager.getPistolBullets(), this.interuptor, this.activateTrap, null, this);
    this.game.physics.arcade.overlap(this.player.weaponManager.getPistolBullets(), this.walls, this.killEntity, null, this.scene);
    this.game.physics.arcade.overlap(this.player.weaponManager.getPistolBullets(), this.trap, this.killEntity, null, this.scene);
    this.trapWeapon.forEach(element => {
      this.game.physics.arcade.overlap(this.enemiesManager.enemyGroup, element.bullets, this.enemiesManager.damageEnemies, null, this.enemiesManager);
      this.game.physics.arcade.overlap(this.player.sprite, element.bullets, this.player.takeBullet, null, this.player);
      this.game.physics.arcade.overlap(element.bullets, this.walls, this.killEntity, null, this);
      this.game.physics.arcade.overlap(element.bullets, this.trap, this.killBullet, null, this);
    });
  };

  updateDeadMenu() {
    if (this.player.controls.retryInputIsActive()) {
      this.restart();
    }
  };

  update() {
    this.updateCollision();
    this.updateOverlap();
    this.enemiesManager.update(this.player, [this.walls, this.trap]);
    if (this.player.isDead()) {
      this.updateDeadMenu();
      return;
    }
    // this.light.updateLight();
  }
  activateTrap(player, interuptor) {
    let bullet = null;
    this.trapWeapon.forEach(element => {
      if (element.trackedSprite.inCamera) {
        bullet = element.fire();
        if (bullet) {
          bullet.trackedSprite = element.trackedSprite;
          this.scene.soundManager.playSound('explosion');
        }
      }
    });
  };
  // Should Absolutely be not here
  takeCoin(player, coin, score) {
    coin.kill();
    this.scene.soundManager.playSound('powerup');
    this.scene.levelManager.score += 100;
    this.player.weaponManager.setGun(this.game.rnd.integerInRange(1, 2));
    this.scene.textManager.textUpdate(null, this.scene.currentScore());
  };
  // LOGIC BINDED TO LEVEL
  playerIsAttacked(player, enemy) {
    if (enemy.state === State.DEAD) {
      return;
    }
    if (enemy.animations.currentAnim.name === 'slash'
      && enemy.animations.currentAnim.currentFrame.index >= 19) {
      this.player.takeDamage(player, enemy);
    }
  };

  killEntity(entity) {
    entity.kill();
  };


  killBullet(entity, trap) {
    if (entity.trackedSprite !== trap) {
      entity.kill();
    }
  };

  enemiesCount() {
    return this.enemiesManager.getEnemiesCount();
  };

  enemiesSprite() {
    return this.enemiesManager.getSprites();
  };

  bulletSprite() {
    this.trapWeapon.forEach(element => {
      element.debug(0, 0, true);
    });
  };

  nextStage(player, exit) {
    let enemiesNbr = + this.enemiesCount();
    if (enemiesNbr === 0) {
      this.scene.soundManager.playSound('clear');
      this.scene.score = this.scene.currentScore();
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
