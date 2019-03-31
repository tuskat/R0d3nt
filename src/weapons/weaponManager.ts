import Scene from '../states/gameScreenScene';

export default class WeaponManager {
    state: Scene = null;
    magazine: number = 3;
    weapon = null;
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
        if (this.canShoot) {
            this.fire();
            return true;
        }
        return false;
    };

    initSmg() {
        this.magazine = 3;
        this.fireInterval = 500;
        this.weapon = this.state.game.add.weapon(30, 'my_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        this.weapon.bulletLifespan = 500;
        this.weapon.bulletSpeed = 1000;
        this.weapon.bulletGravity = new Phaser.Point(-100, -1150);
        this.weapon.bulletAngleOffset = 0;
        this.weapon.bulletAngleVariance = 0;
        this.weapon.fireRate = 50;
        this.weapon.autoFire = false;
        this.weapon.bulletWorldWrap = false;
        this.weapon.enableBody = true;
        this.weapon.trackRotation = true;
    };
    fire() {
        for (let i = 0; i <= this.magazine; i++) {
            if (this.weapon.fireRate > 0) {
                this.state.timer.add(this.weapon.fireRate * i, this.shoot, this);
            } else {
               this.shoot();
            }
        }
        this.canShoot = false;
        this.state.timer.add(this.fireInterval, this.reload, this);
    };

    shoot() {
        this.weapon.fire();
    };

    getPistolBullets() {
        return this.weapon.bullets;
    };

    shootRight(playerSprite) {
        this.weapon.bulletSpeed = 1000;
        this.weapon.bulletAngleOffset = 0;
        this.weaponTracking(true, playerSprite);
    };
    shootLeft(playerSprite) {
        this.weapon.bulletSpeed = -1000;
        this.weapon.bulletAngleOffset = 0;
        this.weaponTracking(false, playerSprite);
    };
    isShooting() {
        if (this.fireButton.isDown) {
            if (this.isShotReleased()) {
                return false;
            }
            return true;
        }
        else
            return false;
    };
    isShotReleased() {
        let released = false;
        released = this.state.input.keyboard.upDuration(this.fireButton, 1000);
        if (released)
            this.state.input.activePointer.justReleased();
        return released;
    };

    weaponTracking(right, playerSprite) {
        if (right)
            this.weapon.trackSprite(playerSprite, 26, -8, true);
        else
            this.weapon.trackSprite(playerSprite, 26, 8, true);
    };
    reload() {
            this.canShoot = !this.canShoot;
    };
}