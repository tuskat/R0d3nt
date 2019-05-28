export default class Title extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private titleText: Phaser.Text = null;
  private pressStartText: Phaser.Text = null;


  public preload(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'my_background');
    this.backgroundTemplateSprite.anchor.setTo(0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'R0D3NT', {
        font: '50px VCR_OSD',
        fill: '#fff'
    });
    this.titleText.anchor.setTo(0.5);

    this.pressStartText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press Space to Start', {
        font: '25px VCR_OSD',
        fill: '#fff'
    });
    this.pressStartText.anchor.setTo(0.5);
  }

  public create(): void {
    this.game.camera.flash(0x000000, 1000);
    this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
  }

  public keyPress(): void {
  this.game.input.keyboard.removeCallbacks();
  this.state.start('scene');
  }
}
