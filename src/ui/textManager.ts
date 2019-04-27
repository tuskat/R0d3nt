export default class TextManager {
    style = { font: '16px VCR_OSD', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    titleStyle = { font: '70px VCR_OSD', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    scoreText;
    lifeText;
    constructor() {

    }

    createText(game, score, life) {
        this.scoreText = game.add.text(10, 0, 'Score : ' + score, this.style);
        this.scoreText.fixedToCamera = true;
        this.lifeText = game.add.text(10, game.height - 30, 'Hp : ' + life, this.style);
        this.lifeText.fixedToCamera = true;
    };
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

    showRetryText(game) {
        let text = game.add.text(0, game.height * 0.125, 'Press X to retry', this.titleStyle);
        text.fixedToCamera = true;
        text.alpha = 0;
        game.add.tween(text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    }
}