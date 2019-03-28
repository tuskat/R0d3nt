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
        let self = this;
        this.enemyGroup.forEachAlive(function (enemy) {
            if (enemy.state !== State.DEAD) {
                if (!player.isDead()) {
                    self.seekPlayer(enemy, player, walls, self);
                } else {
                    enemy.state = State.CONFUSED;
                }
                self.act(enemy, player);
            } else {
                self.erase(enemy);
            }
        });
    };
    act = function(enemy, player) {
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
    seekPlayer(enemy, player,  walls, self) {
        if (enemy.onCooldown) {
            return;
        }
        if (self.trackPlayer(enemy, player.sprite, walls)) {
            if (self.inAttackRange(enemy, player.sprite)) {
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
            enemy.body.velocity.x = - this.ACCELERATION;
            enemy.scale.x = -this.scale;
            enemy.facingRight = false;
        }
        else if (enemy.x <= (player.x - 30)) {
            enemy.body.velocity.x = this.ACCELERATION;
            enemy.scale.x = this.scale;
            enemy.facingRight = true;
        } else {
            enemy.body.velocity.x = 0;
            if (enemy.animation !== undefined) {
                enemy.animation.playAnimation('idle');
            }
            return;
        }
        if (enemy.animation !== undefined) {
            enemy.animation.playAnimation('run');
        }
    };

    enemiesOverlap(player) {
        this.game.physics.arcade.overlap(player.weaponManager.getBullets(), this.enemyGroup, this.damageEnemies, null, this);
    }

    damageEnemies(bullet, enemy) {
        let collided = false;
        if (enemy.status !== State.DEAD) {
            enemy.body.velocity.x = this.getKnockBack(enemy, bullet);
            enemy.life--;
            this.showEnemyDamage(enemy);
            bullet.kill();
            collided = true;
            this.scene.score += 25;
            this.scene.textManager.textUpdate(null, this.scene.score);
        }
        if (enemy.life <= 0) {
            enemy.state = State.DEAD;
            this.scene.timer.add(800, this.killEnemy, this, enemy);
        }
        return collided;
    };
    killEnemy(enemy) {
        enemy.kill();
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

    inAttackRange = function(enemy, player) {
        if (enemy.onCooldown) {
            return false;
        }
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        return this.shouldAttack(ray);
    };
    trackPlayer(enemy, player, walls) {
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        let intersect = this.getWallIntersection(ray, walls, enemy.sight.x);
        if (intersect !== null) {
            return false;
        } else if (ray.height > enemy.sight.y
            || ray.width > enemy.sight.x)  {
            return false;
        } else {
            return true;
        }
    };
    erase(enemy) {
        if (!enemy.dying) {
            enemy.animation.playAnimation('idle', false);
            enemy.dying = true;
            let pos = { x: enemy.x, y: enemy.y };
            enemy.reset(pos.x, pos.y);
            enemy.angle = 180;
            enemy.frame = 1;
            enemy.body.velocity.y = -600;
            this.game.add.tween(enemy).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
            this.game.camera.shake(0.01, 250);
        }
    };
    shouldAttack(ray) {
        let distance = 30;
        if ((ray.width <= distance) && (ray.height <= distance)) {
            return true;
        }
        return false;
    };
    attack(enemy) {
        if (!enemy.onCooldown) {
            enemy.body.velocity.x = 0;
            enemy.animation.playAnimation('slash', 15, false);
            this.scene.timer.add(1000, this.recharge , this, enemy);
            enemy.onCooldown = true;
        }
    };
    recharge = function(enemy) {
        enemy.onCooldown = false;
    };
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