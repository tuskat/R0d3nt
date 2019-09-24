export default class End extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private titleText: Phaser.Text = null;
  private pressStartText: Phaser.Text = null;

  public preload(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'my_background');
    this.backgroundTemplateSprite.anchor.setTo(0.5);
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'THANKS FOR PLAYING !!\n\nGAME MADE BY TUSKAT\n MUSIC BY BAD ASS WOLF SHIRT\nNINJA SPRITES BY MARVIN Z\n\nR0d3nt is a FREE game', {
        font: '30px VCR_OSD',
        fill: '#fff'
    });
    this.titleText.anchor.setTo(0.5);
    this.titleText.fixedToCamera = true;
    this.pressStartText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press Space to Restart', {
        font: '25px VCR_OSD',
        fill: '#fff'
    });
    this.pressStartText.fixedToCamera = true;
    this.pressStartText.anchor.setTo(0.5);
  }

  public create(): void {
    this.game.stage.backgroundColor = 0x000000;
    this.game.camera.flash(0x000000, 1000);
    this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
  }

  public keyPress(): void {
  this.game.input.keyboard.removeCallbacks();
  this.state.start('scene');
  }
}
