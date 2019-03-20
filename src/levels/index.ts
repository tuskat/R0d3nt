import * as Assets from '../assets';
import Player from '../player/';
import Scene from '../states/scene';
import EnemiesManager from '../enemies';
import LightManager from './light/';
import TextManager from '../text/';
import GameLogic from '../gamelogic/';

const enum State {
    IDLE = 1,
    CHASE,
    CONFUSED,
    DEAD
};

const enum Tiles {
    FLOOR = 1,
    WALL,
    TOP,
    BOTTOM,
    PLAYER,
    SPAWN,
    BOSS,
    FLAG,
    COINS,
    LIGHT
};

export default class LevelManager extends GameLogic {
    private scale: number = 1.5;

    GetJsonLevel(lvlIndex) {
        let levelJson = this.game.cache.getJSON('map' + lvlIndex);

        if (levelJson === null) {
            levelJson = this.game.cache.getJSON('hub');
            let level = levelJson;
            this.state.level = 0;
            return level;
        } else {
            let level = levelJson;

            return level;
        }
    }

    getLevel(lvlIndex): string[] {
        return this.GetJsonLevel(lvlIndex);
    }


    initLevel = function () {
        this.enemiesManager = new EnemiesManager(this.game, this.state);
        this.walls = this.game.add.group();
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();
        this.exit = this.game.add.group();
    };


    initLightManager = function (lightSource, worldSize) {
        this.light = new LightManager(this.walls, this.game, this.state);
        this.light.createLight(lightSource, worldSize);
        this.light.updateLight();
        this.state.initGradientBackground();
    };

    nextStage = function (player, exit) {
        let enemiesNbr = + this.enemiesCount();
        if (enemiesNbr === 0) {
            this.state.level = this.state.level + 1;
            this.game.state.start('scene');
        }
    };
    restart = function () {
        this.player.life = 3;
        this.player.invincibility = false;
        this.game.state.start('scene');
    };
    recursiveDeletion = function (x) {
        if (x <= 100)
            return x;
        else
            return this.recursiveDeletion(x - 100);
    };
    setScale = function (item) {
        item.scale.y = this.scale;
        item.scale.x = this.scale;
    };

    createLevel = function (player) {
        let levelTileSize = 32 * this.scale;
        let lightSource = { x: 0, y: 0 };
        let worldSize = { x: 0, y: 0 };
        let level = this.getLevel(this.state.level);
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
                        this.enemiesManager.initBoss(hX, hY, level.enemies, levelTileSize);

                        break;
                    }
                    case Tiles.BOSS: {
                        this.enemiesManager.initBoss(hX, hY, levelTileSize);

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
        this.textManager.levelTitle(level.title, this.game);
        return level.new;
    };
}
