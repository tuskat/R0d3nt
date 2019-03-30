import Scene from '../states/gameScreenScene';

export default class WeaponManager {
    state: Scene = null;
    pellet: number = 0;
    pistol = null;
    fireButton = null;
    canShoot = true;
    fireInterval: number = 0;
    constructor(state) {
        this.state = state;
    }

    initWeapon(shootKey = Phaser.KeyCode.SPACEBAR) {
        this.initSmg();
        this.fireButton = this.state.input.keyboard.addKey(shootKey);
    };

    fireAction() {
        if (this.canShoot && this.pistol !== undefined) {
            console.log('shoot');
            this.fire();
            return true;
        }
        return false;
    };

    initSmg() {
        this.pellet = 3;
        this.fireInterval = 500;
        this.pistol = this.state.game.add.weapon(30, 'my_bullet');
        this.pistol.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        this.pistol.bulletLifespan = 500;
        this.pistol.bulletSpeed = 1000;
        this.pistol.bulletGravity = new Phaser.Point(-100, -1150);
        this.pistol.bulletAngleOffset = 0;
        this.pistol.bulletAngleVariance = 0;
        this.pistol.fireRate = 50;
        this.pistol.autoFire = false;
        this.pistol.bulletWorldWrap = false;
        this.pistol.enableBody = true;
        this.pistol.trackRotation = true;
    };
    fire() {
        console.log(this);
        this.pistol.fire();
        this.canShoot = false;
        this.state.timer.add(this.fireInterval, this.restoreInterval, this);
    };


    getPistolBullets() {
        return this.pistol.bullets;
    };

    shootRight(playerSprite) {
        this.pistol.bulletSpeed = 1000;
        this.pistol.bulletAngleOffset = 0;
        this.weaponTracking(true, playerSprite);
    };
    shootLeft(playerSprite) {
        this.pistol.bulletSpeed = -1000;
        this.pistol.bulletAngleOffset = 0;
        this.weaponTracking(false, playerSprite);
    };
    isShooting() {
        if (this.fireButton.isDown)
            return true;
        else
            return false;
    };
    isShotReleased() {
        let released = false;
        released = this.state.input.keyboard.upDuration(this.fireButton);
        if (released)
            this.state.input.activePointer.justReleased();
        return released;
    };

    weaponTracking(right, playerSprite) {
        if (right)
            this.pistol.trackSprite(playerSprite, 26, -8, true);
        else
            this.pistol.trackSprite(playerSprite, 26, 8, true);
    };
    restoreInterval() {
        this.canShoot = !this.canShoot;
    };
}