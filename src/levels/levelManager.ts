import Player from '../player/player';
import Scene from '../states/gameScreenScene';
import EnemiesManager from '../enemies/enemiesManager';
import LightManager from './light/lightManager';
import TextManager from '../text/textManager';

const enum Tiles {
    FLOOR = 1,
    WALL,
    TOP,
    BOTTOM,
    PLAYER,
    SPAWN,
    SLASHER,
    FLAG,
    COINS,
    LIGHT
};

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
}

export default class LevelManager {
    private scale: number = 1.5;

    public ground: Phaser.Group = null;
    public map: Phaser.Tilemap = null;
    public exit: Phaser.Group = null;
    public walls: Phaser.Group = null;
    public coins: Phaser.Group = null;
    public layer: Phaser.TilemapLayer = null;

    public game: Phaser.Game = null;
    public scene: Scene = null;
    public enemiesManager: EnemiesManager;
    public textManager: TextManager = new TextManager();
    public light: LightManager = null;
    public player: Player;

    constructor(game, player, scene) {
        this.game = game;
        this.scene = scene;
        this.player = player;
    }

    // Update

    updateCollision() {
        this.game.physics.arcade.collide(this.player.sprite, this.walls);
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
        if (this.player.controls.RetryInputIsActive()) {
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
    // Level Creation
    recursiveDeletion(x) {
        if (x <= 100)
            return x;
        else
            return this.recursiveDeletion(x - 100);
    };

    setScale(item) {
        item.scale.y = this.scale;
        item.scale.x = this.scale;
    };

    getJsonData(lvlIndex) {
        let levelJson = this.game.cache.getJSON('map' + lvlIndex);

        if (levelJson === null) {
            levelJson = this.game.cache.getJSON('hub');
            let level = levelJson;
            this.scene.level = 0;
            return level;
        } else {
            let level = levelJson;
            return level;
        }
    }

    getLevel(lvlIndex) {
        return this.getJsonData(lvlIndex);
    }


    initLevel() {
        this.enemiesManager = new EnemiesManager(this.game, this.scene);
        this.walls = this.game.add.group();
        this.coins = this.game.add.group();
        this.exit = this.game.add.group();
    };


    initLightManager(lightSource, worldSize) {
        this.light = new LightManager(this.walls, this.game, this.scene);
        this.light.createLight(lightSource, worldSize);
        this.light.updateLight();
        this.scene.initGradientBackground();
    };

    createLevel(player) {
        let levelTileSize = 32 * this.scale;
        let lightSource = { x: 0, y: 0 };
        let worldSize = { x: 0, y: 0 };
        let level = this.getLevel(this.scene.level);
        level.enemies = 5;
        // console.log(level);
        let layout = level.layers[0].data;
        let height = level.layers[0].height;
        let width = level.layers[0].width;

        worldSize.x = width * levelTileSize;
        worldSize.y = height * levelTileSize;
        this.game.world.setBounds(0, 0, worldSize.x, worldSize.y);
        this.initLevel();
        let i = 0;
        // Create the level by going through the array
        for (let hY = 0; hY < height; hY++) {
            for (let hX = 0; hX < width; hX++) {

                switch (layout[i]) {
                    case Tiles.FLOOR: {
                        let wall = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'block');
                        this.walls.add(wall);
                        wall.body.immovable = true;
                        wall.body.allowGravity = false;
                        // wall.body.friction.y = -0.5;
                        this.setScale(wall);
                        break;
                    }
                    case Tiles.WALL: {
                        let wall = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'block');
                        this.walls.add(wall);
                        wall.body.immovable = true;
                        wall.body.allowGravity = false;
                        wall.body.checkCollision.up = false;
                        wall.body.checkCollision.down = false;
                        //  wall.body.friction.y = -0.5;
                        this.setScale(wall);
                        break;
                    }
                    case Tiles.TOP: {
                        let wall = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'block');
                        this.walls.add(wall);
                        wall.body.immovable = true;
                        wall.body.allowGravity = false;
                        wall.body.checkCollision.down = false;
                        //   wall.body.friction.y = -0.5;
                        this.setScale(wall);
                        break;
                    }
                    case Tiles.BOTTOM: {
                        let wall = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'block');
                        this.walls.add(wall);
                        wall.body.immovable = true;
                        wall.body.allowGravity = false;
                        wall.body.checkCollision.up = false;
                        this.setScale(wall);
                        //  wall.body.friction.y = -0.5;

                        break;
                    }
                    case Tiles.COINS: {
                        let coin = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'ball');
                        this.coins.add(coin);
                        coin.body.allowGravity = false;

                        break;
                    }
                    case Tiles.SPAWN: {
                        this.enemiesManager.initSlasher(hX, hY, levelTileSize);

                        break;
                    }
                    case Tiles.SLASHER: {
                        this.enemiesManager.initSlasher(hX, hY, levelTileSize);

                        break;
                    }
                    case Tiles.PLAYER: {
                        player.sprite.x = levelTileSize * hX;
                        player.sprite.y = levelTileSize * hY;

                        break;
                    }
                    case Tiles.FLAG: {
                        let exit = this.game.add.sprite(levelTileSize * hX, (levelTileSize * hY) + 20, 'flag');
                        this.exit.add(exit);
                        exit.body.immovable = true;
                        exit.body.allowGravity = false;
                        break;
                    }
                    case Tiles.LIGHT: {
                        lightSource.x = levelTileSize * hX;
                        lightSource.y = (levelTileSize * hY) + 20;

                        break;
                    }
                    default: {
                        break;
                    }
                }
                i++;
            }
        }

        this.initLightManager(lightSource, worldSize);
        this.textManager.levelTitle(level.title, this.game, player);
        return level.new;
    };
}
