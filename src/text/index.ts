export default class TextManager {
    style = { font: '16px Havana', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
    scoreText;
    lifeText;
    constructor() {

    }

    createText = function (game, score, life) {
        this.scoreText = game.add.text(10, 0, 'Score : ' + score, this.style);
        this.scoreText.fixedToCamera = true;
        this.lifeText = game.add.text(10, game.height - 30, 'Hp : ' + life, this.style);
        this.lifeText.fixedToCamera = true;
    };
    updateShadows = function () {
        this.textShadow(this.scoreText);
        this.textShadow(this.lifeText);
    };

    textUpdate = function (life, score) {
        this.lifeText.setText('Hp :' + life);
        this.scoreText.setText('Score :' + score);
    };
    textShadow = function (text) {
        text.setShadow(1, 1, 'rgba(0, 0, 0, 0.5)', 1);
    };

    levelTitle = function (levelName, game) {
        let posX = game.width / 4;
        let posY = game.height / 4;
        let style = { font: '70px Havana', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };



        let text = game.add.text(posX, posY, levelName, style);
        let textReflect = game.add.text(posX, posY + 50, levelName, style);


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
}