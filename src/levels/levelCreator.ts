import Scene from '../states/gameScreenScene';
import EnemiesManager from '../enemies/enemiesManager';
import LightManager from './light/lightManager';
import TextManager from '../ui/textManager';
import Player from '../player/player';

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
    LIGHT,
    INTERUPTOR,
    TRAP_UP,
    TRAP_DOWN,
    TRAP_LEFT,
    TRAP_RIGHT,
    GLASS,
    DASHER,
    ARROW
};
const enum Orientation {
    UP = 1,
    DOWN,
    LEFT,
    RIGHT
}

export default class LevelCreator  {
    private scale: number = 1.5;
    public score = 0;
    public ground: Phaser.Group = null;
    public map: Phaser.Tilemap = null;
    public exit: Phaser.Group = null;
    public walls: Phaser.Group = null;
    public glass: Phaser.Group = null;
    public coins: Phaser.Group = null;
    public interuptor: Phaser.Group = null;
    public trap: Phaser.Group = null;
    public trapWeapon: Phaser.Weapon[] = null;
    public layer: Phaser.TilemapLayer = null;
    public player: Player;
    public game: Phaser.Game = null;
    public scene: Scene = null;
    public enemiesManager: EnemiesManager;
    public textManager: TextManager = new TextManager();
    public light: LightManager = null;

    constructor(game, player, scene) {
        this.game = game;
        this.scene = scene;
        this.player = player;
    }

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
        if(this.walls) {
            this.walls.destroy(true);
            this.glass.destroy(true);
        }
        this.trapWeapon = [];
        this.coins = this.game.add.group();
        this.trap = this.game.add.group();
        this.interuptor = this.game.add.group();
        this.exit = this.game.add.group();
        this.enemiesManager = new EnemiesManager(this.game, this.scene);
        this.glass = this.game.add.group();
        this.walls = this.game.add.group();
        this.score = 0;
    };

    initTrap(trap, rotation) {
        let trapWeapon = this.game.add.weapon(1, 'cannon_ball', 5, this.trap);
        trapWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        trapWeapon.bulletSpeed = 400;
        trapWeapon.bulletGravity = new Phaser.Point(0, -1150);
        switch (rotation) {
            case Orientation.DOWN: {
                trapWeapon.fireAngle = 90;
                trapWeapon.setBulletBodyOffset(20, 32, 6, 6);
                trapWeapon.trackSprite(trap, trap.width / 1.5, trap.height, false);
                break;
            }
            case Orientation.UP: {
                trapWeapon.bulletAngleOffset = 0;
                trapWeapon.setBulletBodyOffset(20, 32, 6, -6);
                trapWeapon.trackSprite(trap, trap.width * 0.7, trap.height * 0.7, false);
                break;
            }
            case Orientation.LEFT: {
                trapWeapon.fireAngle = 180;
                trapWeapon.setBulletBodyOffset(32, 20, -6, 6);
                trapWeapon.trackSprite(trap, 0, trap.height / 1.5, false);
                break;
            }
            case Orientation.RIGHT: {
                trapWeapon.fireAngle = 0;
                trapWeapon.setBulletBodyOffset(32, 20, 6, 6);
                trapWeapon.trackSprite(trap, trap.width, trap.height / 1.5, false);
                break;
            }
        }
        this.trapWeapon.push(trapWeapon);
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
                    case Tiles.INTERUPTOR: {
                        let interuptor = this.game.add.sprite(levelTileSize * hX, (levelTileSize * hY) + 10, 'trigger');
                        this.interuptor.add(interuptor);
                        interuptor.body.allowGravity = false;
                        break;
                    }
                    case Tiles.COINS: {
                        let coin = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'ball');
                        this.coins.add(coin);
                        coin.body.allowGravity = false;

                        break;
                    }
                    case Tiles.SPAWN: {
                        this.enemiesManager.initEnemySpawn(hX, hY, 5, levelTileSize);
                        break;
                    }
                    case Tiles.DASHER: {
                        this.enemiesManager.initDasher(hX, hY, levelTileSize);

                        break;
                    }
                    case Tiles.SLASHER: {
                        this.enemiesManager.initSlasher(hX, hY, levelTileSize);

                        break;
                    }
                    case Tiles.PLAYER: {
                        player.sprite.x = (levelTileSize * hX) + 16;
                        player.sprite.y = levelTileSize * hY;

                        break;
                    }
                    case Tiles.FLAG: {
                        let exit = this.game.add.sprite(levelTileSize * hX, (levelTileSize * hY) - 10, 'exit');
                        this.exit.add(exit);
                        exit.body.immovable = true;
                        exit.body.allowGravity = false;

                        break;
                    }
                    case Tiles.ARROW: {
                        let arrow = this.game.add.sprite(levelTileSize * hX, (levelTileSize * hY), 'arrow');
                        this.walls.add(arrow);
                        arrow.body.immovable = true;
                        arrow.body.allowGravity = false;
                        arrow.body.checkCollision.left = false;
                        arrow.body.checkCollision.right = false;
                        arrow.body.checkCollision.up = false;
                        arrow.body.checkCollision.down = false;
                        break;
                    }
                    case Tiles.LIGHT: {
                        lightSource.x = levelTileSize * hX;
                        lightSource.y = (levelTileSize * hY) + 20;
                        break;
                    }
                    case Tiles.TRAP_UP: {
                        let trap = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'cannon');
                        this.trap.add(trap);
                        trap.body.immovable = true;
                        trap.body.allowGravity = false;
                        this.initTrap(trap, Orientation.UP);
                        this.setScale(trap);
                        break;
                    }
                    case Tiles.TRAP_DOWN: {
                        let trap = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'cannon_down');
                        this.trap.add(trap);
                        trap.body.immovable = true;
                        trap.body.allowGravity = false;
                        this.initTrap(trap, Orientation.DOWN);
                        this.setScale(trap);
                        break;
                    }
                    case Tiles.TRAP_LEFT: {
                        let trap = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'cannon_left');
                        this.trap.add(trap);
                        trap.body.immovable = true;
                        trap.body.allowGravity = false;
                        trap.body.checkCollision.down = false;
                        this.initTrap(trap, Orientation.LEFT);
                        this.setScale(trap);
                        break;
                    }
                    case Tiles.TRAP_RIGHT: {
                        let trap = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'cannon_right');
                        this.trap.add(trap);
                        trap.body.immovable = true;
                        trap.body.allowGravity = false;
                        trap.body.checkCollision.down = false;
                        this.initTrap(trap, Orientation.RIGHT);
                        this.setScale(trap);
                        break;
                    }
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
                    case Tiles.GLASS: {
                        let glass = this.game.add.sprite(levelTileSize * hX, levelTileSize * hY, 'glass');
                        this.glass.add(glass);
                        glass.body.immovable = true;
                        glass.body.allowGravity = false;
                        this.setScale(glass);
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
                    default: {
                        break;
                    }
                }
                i++;
            }
        }
        player.sprite.bringToTop();
        this.initLightManager(lightSource, worldSize);
        this.textManager.levelTitle(level.layers[0].properties[0].value, this.game, player);
        return level.new;
    };
}
