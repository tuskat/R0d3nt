import EnemiesFactory from './factory';

const enum Status {
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
            if (enemy.state === Status.DEAD) {
                return;
            } else {
                self.seekPlayer(enemy, player, walls, self);
            }
            self.act(enemy, player);
        });
    };
    act = function(enemy, player) {
        switch (enemy.state) {
            case Status.CHASE: {
                this.runToPlayer(player.sprite, enemy);
                break;
            }
            case Status.CONFUSED: {
                this.idle(enemy);
                break;
            }
            case Status.ATTACKING: {
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
        if (self.enemiesSight(enemy, player.sprite, walls)) {
            if (self.inAttackRange(enemy, player.sprite)) {
                enemy.state = Status.ATTACKING;
            } else {
                enemy.state = Status.CHASE;
            }
        } else {
            enemy.state = Status.CONFUSED;
        }
    };
    idle = function (enemy) {
        if (enemy.status === Status.DEAD) {
            return;
        }
        else {
            enemy.body.velocity.x = 0;
            if (enemy.animation !== undefined) {
                enemy.animation.playAnimation('idle', 4);
            }
        }
    };
    runToPlayer = function (player, enemy) {
        if (enemy.x > player.x) {
            enemy.body.velocity.x = - this.ACCELERATION;
            enemy.scale.x = -this.scale;
            enemy.facingRight = false;
        }
        else {
            enemy.body.velocity.x = this.ACCELERATION;
            enemy.scale.x = this.scale;
            enemy.facingRight = true;
        }
        if (enemy.animation !== undefined) {
            enemy.animation.playAnimation('run');
        }
    };
    inAttackRange = function(enemy, player) {
        let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        return this.shouldAttack(ray);
    };
    enemiesSight = function (enemy, player, walls) {
        if (enemy.status === Status.DEAD) {
            return false;
        } else {
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
        }
    };

    shouldAttack = function (ray) {
        let distance = 35;
        if (ray.width <= distance) {
            return true;
        }
        return false;
    };

    attack = function (enemy) {
        enemy.body.velocity.x = 0;
        enemy.animation.playAnimation('slash', false);
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