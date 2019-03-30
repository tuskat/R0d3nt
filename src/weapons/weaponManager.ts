import Scene from '../states/gameScreenScene';

export default class WeaponManager {
    state: Scene = null;
    pellet: number = 0;
    pistol: Phaser.Weapon;
    cannon: Phaser.Weapon;
    fireButton = null;
    chargeButton = null;
    canShoot = true;
    fireInterval: number = 0;
    constructor(state) {
        this.state = state;
    }

    initWeapon(shootKey = Phaser.KeyCode.SPACEBAR, chargeKey = Phaser.KeyCode.ALT) {
        this.pistol = this.initSmg();
        this.cannon = this.initChargedShot();
        this.fireButton = this.state.input.keyboard.addKey(shootKey);
        this.chargeButton = this.state.input.keyboard.addKey(chargeKey);
    };

    fireAction(weapon) {
        if (this.canShoot) {
            this.Fire(weapon);
            return true;
        }
        return false;
    };

    initSmg() {
        let weapon;
        weapon = this.state.game.add.weapon(30, 'my_bullet');
        weapon.pellet = 4;
        weapon.bullets.damage = 1;
        weapon.fireInterval = 500;
        weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        weapon.bulletLifespan = 500;
        weapon.bulletSpeed = 2000;
        weapon.bulletGravity = new Phaser.Point(-100, -1150);
        weapon.bulletAngleVariance = 0;
        weapon.fireRate = 50;
        weapon.autoFire = false;
        weapon.bulletWorldWrap = false;
        weapon.enableBody = true;
        weapon.trackRotation = true;
        return weapon;
    };
    initChargedShot() {
        let weapon;
        weapon = this.state.game.add.weapon(30, 'bullet');
        weapon.pellet = 1;
        weapon.bullets.damage = 3;
        weapon.fireInterval = 1000;
        weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        weapon.bulletLifespan = 500;
        weapon.bulletSpeed = 1500;
        weapon.bulletGravity = new Phaser.Point(-100, -1150);
        weapon.bulletAngleVariance = 0;
        weapon.fireRate = 50;
        weapon.autoFire = false;
        weapon.bulletWorldWrap = false;
        weapon.enableBody = true;
        weapon.trackRotation = true;
        return weapon;
    };
    Fire(weapon) {
        for (let i = 0; i < weapon.pellet; i++) {
            if (weapon.fireRate > 0)
                this.state.timer.add(weapon.fireRate * i, this.Shoot, this, weapon);
            else
                this.Shoot(weapon);
        }
        this.canShoot = false;
        this.state.timer.add(weapon.fireInterval, this.restoreInterval, this);
    };
    Shoot(weapon) {
        weapon.fire();
    };

    getPistolBullets() {
        if (this.pistol !== undefined) {
            return this.pistol.bullets;
        }
    };

    getCanonBullets() {
        if (this.cannon !== undefined) {
            return this.cannon.bullets;
        }
    };

    shootRight(playerSprite, weapon) {
        weapon.bulletSpeed = 1000;
        weapon.bulletAngleOffset = 0;
        this.weaponTracking(true, playerSprite);
    };
    shootLeft(playerSprite, weapon) {
        weapon.bulletSpeed = -1000;
        weapon.bulletAngleOffset = -180;
        this.weaponTracking(false, playerSprite);
    };
    isShooting() {
        if (this.fireButton.isDown)
            return true;
        else
            return false;
    };
    isChargedShotting() {
        if (this.chargeButton.isDown)
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
        if (right) {
            this.pistol.trackSprite(playerSprite, 26, -8, true);
            this.cannon.trackSprite(playerSprite, 26, -8, true);
        } else {
            this.pistol.trackSprite(playerSprite, 26, 8, true);
            this.cannon.trackSprite(playerSprite, 26, 8, true);
        }
    };
    restoreInterval() {
        this.canShoot = !this.canShoot;
    };
}
    // Exemple of a shotgun playing around
    // initShotGun(weapon) {
    //     weapon.pellet = 15;
    //     weapon.fireInterval = 400;
    //     this.weapon = this.state.game.add.weapon(30, 'my_bullet');
    //     this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    //     this.weapon.bulletLifespan = 100;
    //     this.weapon.bulletSpeed = 2000;
    //     this.weapon.bulletGravity = new Phaser.Point(-100, -1150);
    //     this.weapon.bulletAngleVariance = 10;
    //     this.weapon.fireRate = 0;
    //     this.weapon.autoFire = false;
    //     this.weapon.bulletWorldWrap = false;
    //     this.weapon.enableBody = true;
    //     this.weapon.trackRotation = true;
    // };