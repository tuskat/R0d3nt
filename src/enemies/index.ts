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
            if (enemy.state !== Status.DEAD) {
                if (self.enemiesSight(enemy, player.sprite, walls)) {
                    if (enemy.state !== Status.ATTACKING)
                        self.runToPlayer(player.sprite, enemy);
                }

            }
        });
    };
    enemieRoutine = function (enemy) {
        if (enemy.status !== Status.DEAD
            && enemy.wandering === false) {
            let seek = 4000;
            if (enemy.status !== Status.IDLE)
                seek = 300 + this.game.rnd.integerInRange(200, 500);
            this.state.timer.add(seek, this.wanderAroundAimlessly, this, enemy);
        }
    };
    wanderAroundAimlessly = function (enemy) {
        if (enemy.status !== Status.DEAD
            && enemy.status !== Status.CHASE
            && enemy.status !== Status.ATTACKING) {
            enemy.wandering = true;
            enemy.scale.x = -enemy.scale.x;
            enemy.facingRight = !enemy.facingRight;
            if (enemy.facingRight === true)
                enemy.body.velocity.x = this.ACCELERATION;
            else
                enemy.body.velocity.x = -this.ACCELERATION;

            if (enemy.animation !== undefined) {
                enemy.animation.playAnimation('run');
            }
            let seek = 2000 + this.game.rnd.integerInRange(2000, 5000);
            this.state.timer.add(seek, this.wanderAroundAimlessly, this, enemy);
        }
    };
    runToPlayer = function (player, enemy) {
        if (enemy.status !== Status.ATTACKING) {
            enemy.wandering = false;
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
        }
    };
    enemiesSight = function (enemy, player, walls) {
        if (enemy.status !== Status.DEAD) {
            let ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
            let intersect = this.getWallIntersection(ray, walls, enemy.sight.x);
            if (intersect) {
                return false;
            } else {
                if (ray.height < enemy.sight.y
                    && ray.width < enemy.sight.x) {
                    if (enemy.x > player.x) {
                        // enemy.status = Status.CHASE;
                        return this.handleAttack(enemy, ray);
                    }
                    else if (enemy.x < player.x) {
                        // enemy.status = Status.CHASE;
                        return this.handleAttack(enemy, ray);
                    }
                    enemy.status = Status.CONFUSED;
                    return false;
                }
            }
        }
        return false;
    };

    handleAttack = function (enemy, ray) {
        let distance = 35;
        if (enemy.type === EnemyType.MOB) {
            enemy.status = Status.CHASE;
            return true;
        } else {
            if (ray.width <= distance && enemy.status !== Status.ATTACKING) {
                this.Attack(enemy);
                return false;
            }
            return true;
        }
    };

    Attack = function (enemy) {
        enemy.status = Status.ATTACKING;
        enemy.body.velocity.x = 0;
        enemy.animation.playAnimation('slash', 10, false);

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