export default class TextManager {
    style = { font: '16px VCR_OSD', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    pauseStyle = { font: '28px VCR_OSD', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    titleStyle = { font: '50px VCR_OSD', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    scoreText;
    lifeText;
    pauseText;
    instructionsText;
    poly;
    pauseBackground;
    constructor() {

    }

    createText(game, score, life) {
        let instructions = "Arrows to move\nUp is Jump\nPress X to shoot\nPress C to dash"
        this.scoreText = game.add.text(10, 0, 'Score : ' + score, this.style);
        this.scoreText.fixedToCamera = true;
        this.lifeText = game.add.text(10, game.height - 30, 'Hp : ' + life, this.style);
        this.lifeText.fixedToCamera = true;
        this.createBG(game);
        this.pauseText = game.add.text(game.width * 0.425, game.height * 0.3, 'Pause', this.pauseStyle);
        this.pauseText.fixedToCamera = true;
        this.pauseText.alpha = 0;
        this.instructionsText = game.add.text(game.width * 0.30, game.height * 0.4, instructions, this.pauseStyle);
        this.instructionsText.fixedToCamera = true;
        this.instructionsText.alpha = 0;
    };
    createBG(game) {
        this.poly = new Phaser.Rectangle(0, 0, game.width * 0.35, game.height * 0.35);
        this.pauseBackground = game.add.graphics(game.width * 0.25, game.height * 0.25);
        this.pauseBackground.beginFill(0x182240, 0.5);
        this.pauseBackground.drawRect(0, 0, game.width * 0.5, game.height * 0.5);
        this.pauseBackground.endFill();
        this.pauseBackground.fixedToCamera = true;
        this.pauseBackground.body.immovable = true;
        this.pauseBackground.body.allowGravity = false;
        this.pauseBackground.alpha = 0;
    }
    updateShadows() {
        this.textShadow(this.scoreText);
        this.textShadow(this.lifeText);
    };

    textUpdate(life, score) {
        if (life !== null) {
            this.lifeText.setText('Hp :' + life);
        }
        this.scoreText.setText('Score :' + score);
    };
    textShadow(text) {
        text.setShadow(1, 1, 'rgba(0, 0, 0, 0.5)', 1);
    };

    levelTitle(levelName, game, player) {
        let posX = 100;
        let posY = player.sprite.y - 200;

        let text = game.add.text(posX, posY, levelName, this.titleStyle);
        let textReflect = game.add.text(posX, posY + 50, levelName, this.titleStyle);

        text.body.allowGravity = false;
        textReflect.body.allowGravity = false;
        let grd = textReflect.context.createLinearGradient(0, 0, 0, text.canvas.height);
        grd.addColorStop(0, 'rgba(255,255,255,0)');
        grd.addColorStop(1, 'rgba(255,255,255,0.08)');
        textReflect.fill = grd;
        game.add.tween(text).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        game.add.tween(text).to({ alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
        game.add.tween(textReflect).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        game.add.tween(textReflect).to({ alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
    };
    showPauseText() {
        this.pauseText.alpha = 1;
        this.pauseBackground.alpha = 1;
        this.instructionsText.alpha = 1;
    }
    hidePauseText() {
        this.pauseText.alpha = 0;
        this.pauseBackground.alpha = 0;
        this.instructionsText.alpha = 0;
    }
    showRetryText(game) {
        let text = game.add.text(game.width * 0.25, game.height * 0.25, 'Press X to retry', this.pauseStyle);
        text.fixedToCamera = true;
        text.alpha = 0;
        game.add.tween(text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    }
}