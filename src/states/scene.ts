import * as Assets from '../assets';
import * as AssetUtils from '../utils/assetUtils';
import LevelManager from '../levels/';
import TextManager from '../text';
import Player from '../player/';

//   this.game.load.tilemap('tilemap', Assets.JSON.Level.getJSON(), null, Phaser.Tilemap.TILED_JSON);
//   this.game.load.image('tiles', Assets.Atlases.TilesetsTilesSpritesheet.getPNG());
//   this.game.load.image('flag', Assets.Images.GfxFlag.getPNG());
//   this.game.load.image('rocket', Assets.Images.GfxRocket.getPNG());
//   this.game.load.image('light', Assets.Images.GfxLight.getPNG());
//   this.game.load.json('level', Assets.JSON['LevelsLevel1'].getJSON());

export default class Scene extends Phaser.State {
    private levelManager: LevelManager;
    private textManager: TextManager;
    private player: Player;
    public level: number = 1;
    public background: Phaser.Group = null;
    public sky: Phaser.Sprite = null;
    // enemies;
    light;
    bitmap;
    timer;
    gradient;

    // GAME CYCLE
    public preload(): void {
        this.player = new Player(this.input, this.game, this);
        this.levelManager = new LevelManager(this.game, this.player, this);
        this.textManager = new TextManager();
        this.game.load.spritesheet('cyclops', Assets.Images.MyAssetsMyMonster.getPNG(), 32, 32);
        this.game.load.spritesheet('big_cyclops', Assets.Images.MyAssetsMyBoss2.getPNG(), 64, 128);

        AssetUtils.Loader.loadAllAssets(this.game, null, this);
    }

    public create(): void {
        this.game.camera.flash(0x000000);
        this.game.time.advancedTiming = true;

        this.game.stage.smoothed = false;
        this.game.stage.backgroundColor = 0x4488cc;
        this.background = this.game.add.group();



        this.timer = this.game.time.create(false);
        this.timer.start();

        this.levelManager.score = 0;
        this.player.initPlayer();

        this.game.world.enableBody = true;

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.levelManager.createLevel(this.player);
        this.textManager.createText(this.game, this.levelManager.score, this.player.life);

    }
    public update(): void {
        this.levelManager.updateEnemies();
        this.levelManager.updateOverlap();
        this.levelManager.updateCollision();
        this.player.playerControl();
        this.textManager.updateShadows();
        this.uploadBackground();
    }
    // DEBUG
    public render(): void {
        this.game.debug.text(this.game.time.fps.toString(), this.game.width - 32, 14, '#FFFFFF');
        this.game.debug.text(this.levelManager.enemiesCount(), this.game.width - 32, 32, '#FFFFFF');
        // let enemies = this.levelManager.enemiesSprite();
        // this.game.debug.physicsGroup(enemies);
        // this.game.debug.body(this.player.sprite);
    }
    //
    public initGradientBackground = function () {
        let margin = 50;
        let padding = 200;

        this.gradient = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        let grd = this.gradient.context.createLinearGradient(0, 0, 0, this.game.world.height - padding);
        grd.addColorStop(0, '#457fca');
        grd.addColorStop(1, '#5691c8');
        this.gradient.context.fillStyle = grd;
        this.gradient.context.fillRect(0, 0, this.game.world.width, this.game.world.height - margin);

        this.gradient.context.fillStyle = grd;
        this.gradient.context.fillRect(0, this.game.world.height - margin, this.game.world.width, margin);
        let grad = this.game.add.image(0, 0, this.gradient);
        let bg1 = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'my_background');
        bg1.body.immovable = true;
        bg1.body.allowGravity = false;

        let bg2 = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'my_background2');
        bg2.body.immovable = true;
        bg2.body.allowGravity = false;

        this.background.add(grad);
        this.background.add(bg1);
        this.background.add(bg2);



    };
    public uploadBackground = function () {
        let slide = 0.2;
        this.background.forEachAlive(background => {
            if (background.tilePosition) {
                background.tilePosition.x = -(this.game.camera.x * slide);
                background.tilePosition.y = -(this.game.camera.y * slide / 2);
                slide += 0.4;
            }
        });
    };
}

