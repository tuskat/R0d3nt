import EnemiesFactory from './factory';
import EnemyAnimation from './animations';

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
export default class EnemiesManager extends EnemiesFactory {

    enemiesChase = function (player, walls) {
        let self = this;
        this.sprites.forEachAlive(function (enemy) {
            if (enemy.state !== State.DEAD) {
                self.seekPlayer(enemy, player, walls, self);
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
    seekPlayer = function (enemy, player,  walls, self) {
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
    idle = function (enemy) {
        enemy.body.velocity.x = 0;
        if (enemy.animation !== undefined) {
            enemy.animation.playAnimation('idle', 4);
        }
    };
    runToPlayer = function (player, enemy) {
        if (enemy.x >= (player.x + 15)) {
            enemy.body.velocity.x = - this.ACCELERATION;
            enemy.scale.x = -this.scale;
            enemy.facingRight = false;
        }
        else if (enemy.x <= (player.x - 15)) {
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
    inAttackRange = function(enemy, player) {
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        if (enemy.onCooldown) {
            return false;
        }
        return this.shouldAttack(ray);
    };
    trackPlayer = function (enemy, player, walls) {
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        let intersect = this.getWallIntersection(ray, walls, enemy.sight.x);
        if (intersect !== null) {
            return false;
        } else if (ray.height > enemy.sight.y
            && ray.width > enemy.sight.x)  {
            return false;
        } else {
            return true;
        }
    };
    erase = function (enemy) {
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
    shouldAttack = function (ray) {
        let distance = 15;
        if ((ray.width <= distance) && (ray.height <= distance)) {
            return true;
        }
        return false;
    };
    attack = function (enemy) {
        if (!enemy.onCooldown) {
            enemy.body.velocity.x = 0;
            enemy.animation.playAnimation('slash', 20, false);
            this.state.timer.add(1000, this.recharge , this, enemy);
            enemy.onCooldown = true;
        }
    };
    recharge = function(enemy) {
        enemy.onCooldown = false;
    };
    getWallIntersection = function (ray, walls, sight) {
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