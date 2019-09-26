import { StorageSupport } from '../utils/utils';

export default class Title extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null;
  private titleText: Phaser.Text = null;
  private pressStartText: Phaser.Text = null;

  public preload(): void {
    let menuText = 'Press Anything to Start';
    if (StorageSupport.storageIsSupported()) {
       menuText = window.localStorage.getItem('level') ? 'Press Space to Start\n Enter for New Game' : 'Press Anything to Start';
    } else {
      menuText = 'Press Anything to Start\n\n(Saving is not supported on your browser)';
    }
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'my_background');
    this.backgroundTemplateSprite.anchor.setTo(0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'R0D3NT', {
        font: '50px VCR_OSD',
        fill: '#fff'
    });
    this.titleText.anchor.setTo(0.5);

    this.pressStartText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, menuText, {
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
  let clearedStorage = false;
  if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    localStorage.clear();
    clearedStorage = true;
  }
  this.game.input.keyboard.removeCallbacks();
  this.state.start('scene', true, false, clearedStorage);
  }
}
