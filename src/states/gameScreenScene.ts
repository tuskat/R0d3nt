import LevelManager from '../levels/levelManager';
import TextManager from '../ui/textManager';
import SoundManager from '../ui/soundManager';
import Player from '../player/player';
import PlayerControls from '../player/controls';

export default class Scene extends Phaser.State {
    public levelManager: LevelManager;
    public textManager: TextManager;
    public soundManager: SoundManager;
    private player: Player;
    controls: PlayerControls = null;
    public level: number = 1;
    public background: Phaser.Group = null;
    public sky: Phaser.Sprite = null;
    public score = 0;
    // enemies;
    light;
    bitmap;
    timer;
    gradient;

    // GAME CYCLE
    public preload(): void {
        this.controls = new PlayerControls(this.input, this.game);
        this.player = new Player(this.controls, this.game, this);
        this.levelManager = new LevelManager(this.game, this.player, this);
        this.textManager = new TextManager();
        this.soundManager = new SoundManager(this.game);
    }

    public create(): void {
        this.game.camera.flash(0x000000);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.OVERLAP_BIAS = 8;
        this.game.time.advancedTiming = true;

        this.game.world.enableBody = true;
        this.game.world.updateOnlyExistingChildren = true;
        this.game.physics.setBoundsToWorld();

        this.game.stage.smoothed = false;
        this.game.stage.backgroundColor = 0x4488cc;
        this.background = this.game.add.group();

        this.timer = this.game.time.create(false);
        this.timer.start();
        this.player.initPlayer();

        this.levelManager.createLevel(this.player);
        this.soundManager.initSounds();
        this.textManager.createText(this.game, this.currentScore(), this.player.life);
    }
    public update(): void {
        this.levelManager.update();
        this.player.updatePlayer();
        this.textManager.updateShadows();
        this.uploadBackground();
    }
    // DEBUG
    public render(): void {
        this.game.debug.text(this.game.time.fps.toString(), this.game.width - 32, 14, '#FFFFFF');
        // this.game.debug.text(this.levelManager.enemiesCount(), this.game.width - 32, 32, '#FFFFFF');
        // this.levelManager.bulletSprite();
        // this.game.debug.body(this.player.sprite);
    }
    //
    public currentScore() {
        return this.levelManager.score + this.score;
    };
    public initGradientBackground() {
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
        bg1.fixedToCamera= true;

        let bg2 = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'my_background2');
        bg2.body.immovable = true;
        bg2.body.allowGravity = false;

        this.background.add(grad);
        this.background.add(bg1);
        this.background.add(bg2);
    };
    public uploadBackground() {
        let slide = 0.05;
        this.background.forEachAlive(background => {
            if (background.tilePosition) {
                background.tilePosition.x = -(this.game.camera.x * slide);
                background.tilePosition.y = -(this.game.camera.y * slide / 2);
                slide += 0.05;
            }
        });
    };
}

