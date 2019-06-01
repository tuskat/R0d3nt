import EnemiesFactory from './factory';

const enum State {
    IDLE = 1,
    CHASE,
    CONFUSED,
    ATTACKING,
    DEAD
};
export default class EnemiesManager extends EnemiesFactory {
    update(player, walls) {
        this.enemiesOverlap(this.scene.levelManager.player);
        this.enemyGroup.forEachAlive((enemy) => {
            if (this.isOutBound(enemy)) {
                enemy.state = State.DEAD;
            }
            if (enemy.state !== State.DEAD) {
                this.seekPlayer(enemy, player, walls);
                this.act(enemy, player);
            } else {
                this.erase(enemy);
            }
        });
    };
    act = function (enemy, player) {
        switch (enemy.state) {
            case State.CHASE: {
                this.runToPlayer(player.sprite, enemy);
                break;
            }
            case State.CONFUSED: {
                this.idle(enemy);
                break;
            }
            case State.ATTACKING: {
                this.attack(enemy);
                break;
            }
            default: {
                this.idle(enemy);
                break;
            }
        }
    };
    seekPlayer(enemy, player, walls) {
        if (enemy.onCooldown) {
            return;
        }
        if (this.trackPlayer(enemy, player.sprite, walls)) {
            if (this.inAttackRange(enemy, player.sprite)) {
                enemy.state = State.ATTACKING;
            } else {
                enemy.state = State.CHASE;
            }
        } else {
            enemy.state = State.CONFUSED;
        }
    };
    idle(enemy) {
        enemy.body.velocity.x = 0;
        if (enemy.animation !== undefined) {
            enemy.animation.playAnimation('idle', 4);
        }
    };
    runToPlayer(player, enemy) {
        if (enemy.x >= (player.x + 30)) {
            enemy.body.velocity.x = - this.ACCELERATION + enemy.speed;
            enemy.scale.x = -this.scale;
            enemy.facingRight = false;
        }
        else if (enemy.x <= (player.x - 30)) {
            enemy.body.velocity.x = this.ACCELERATION +  enemy.speed;
            enemy.scale.x = this.scale;
            enemy.facingRight = true;
        } else {
            this.idle(enemy);
            return;
        }
        if (enemy.animation !== undefined) {
            enemy.animation.playAnimation('run');
        }
    };

    enemiesOverlap(player) {
        this.game.physics.arcade.overlap(this.enemyGroup, this.scene.levelManager.player.sprite, this.scene.levelManager.playerIsAttacked, null, this.scene);
        this.game.physics.arcade.overlap(this.enemyGroup, player.weaponManager.getPistolBullets(), this.damageEnemies, null, this);
    };

    damageEnemies(enemy, bullet) {
        let collided = false;

        let bulletDamage = (bullet.trackedSprite) ? 3 : 1;
        if (enemy.status !== State.DEAD) {
            enemy.body.velocity.x = this.getKnockBack(enemy, bullet);
            enemy.life = enemy.life - bulletDamage;
            this.scene.soundManager.playSound('enemy-hit');
            this.showEnemyDamage(enemy);
            if (!bullet.trackedSprite) {
                bullet.kill();
            }
            collided = true;
            this.scene.levelManager.score += (25 * bulletDamage);
            this.scene.textManager.textUpdate(null, this.scene.currentScore());
        }
        if (enemy.life <= 0) {
            enemy.state = State.DEAD;
            return;
        }
        return collided;
    };
    killEnemy(enemy) {
        enemy.kill();
    };
    isOutBound(enemy) {
        if (enemy.body.y > this.game.world.height) {
            this.scene.levelManager.score += 75;
            this.scene.textManager.textUpdate(null, this.scene.currentScore());
            return true;
        }
        return false;
    };
    showEnemyDamage(enemy) {
        let damageColor = 0xc51b10;
        if (enemy.tint === damageColor)
            enemy.tint = 0xffffff;
        else {
            enemy.tint = damageColor;
            this.scene.timer.add(250, this.showEnemyDamage, this, enemy);
        }
    };

    getKnockBack(enemy, bullet) {
        let knockback = bullet.position.x > enemy.body.x ? -1400 : 1400;
        if (enemy.body.velocity.x >= -140 && enemy.body.velocity.x <= 140) {
            knockback = knockback / 10;
        }
        return knockback;
    };

    inAttackRange = function (enemy, player) {
        if (enemy.onCooldown || this.scene.levelManager.player.isDead()) {
            return false;
        }
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        let distance = enemy.attackDistance;
        if ((ray.width <= distance) && (ray.height <= distance)) {
            return true;
        }
        return false;
    };
    trackPlayer(enemy, player, walls) {
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        let blocked = null;
        walls.forEach(element => {
            if (!blocked) {
                blocked = this.getWallIntersection(ray, element, enemy.sight.x);
            }
        });
        if (blocked)  {
            return false;
        } else if (ray.height > enemy.sight.y
            || ray.width > enemy.sight.x) {
            return false;
        } else {
            return true;
        }
    };
    erase(enemy) {
        if (!enemy.dying) {
            enemy.animation.playAnimation('idle', false);
            this.scene.soundManager.playSound('enemy-hit');
            enemy.dying = true;
            let pos = { x: enemy.x, y: enemy.y };
            enemy.reset(pos.x, pos.y);
            enemy.angle = 180;
            enemy.frame = 1;
            enemy.body.velocity.y = -600;
            this.game.add.tween(enemy).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
            this.game.camera.shake(0.01, 250);
            this.scene.timer.add(800, this.killEnemy, this, enemy);
        }
    };

    attack(enemy) {
        if (!enemy.onCooldown) {
            this.attackList[enemy.type](enemy);
        }
    }
    getWallIntersection(ray, walls, sight) {
        let distanceToWall = sight;
        let closestIntersection = null;

        walls.forEach(function (wall) {
            // Create an array of lines that represent the four edges of each wall
            let lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height)
            ];


            for (let i = 0; i < lines.length; i++) {
                let intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    let distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);

        return closestIntersection;
    };

}