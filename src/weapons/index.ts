export default class WeaponManager {
    state: Phaser.State = null;
    pellet: number = 0;
    weapon = null;
    fireButton = null;
    canShoot = true;
    fireInterval: number = 0;
    constructor(state) {
        this.state = state;
    }

    initWeapon = function (shootKey = Phaser.KeyCode.SPACEBAR) {
        this.initSmg();
        // this.initShotGun();
        this.fireButton = this.state.input.keyboard.addKey(shootKey);
    };

    fireAction = function () {
        if (this.canShoot) {
            this.Fire();
            return true;
        }
        return false;
    };

    initShotGun = function () {
        this.pellet = 15;
        this.fireInterval = 400;
        this.weapon = this.state.game.add.weapon(30, 'my_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletSpeed = 3000;
        this.weapon.bulletGravity = new Phaser.Point(-100, -3000);
        this.weapon.bulletAngleVariance = 10;
        this.weapon.fireRate = 0;
        this.weapon.autoFire = false;
        this.weapon.bulletWorldWrap = false;
        this.weapon.enableBody = true;
        this.weapon.trackRotation = true;

    };
    initSmg = function () {
        this.pellet = 3;
        this.fireInterval = 500;
        this.weapon = this.state.game.add.weapon(30, 'my_bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletLifespan = 2000;
        this.weapon.bulletSpeed = 2000;
        this.weapon.bulletGravity = new Phaser.Point(-100, -3000);
        this.weapon.bulletAngleVariance = 0;
        this.weapon.fireRate = 50;
        this.weapon.autoFire = false;
        this.weapon.bulletWorldWrap = false;
        this.weapon.enableBody = true;
        this.weapon.trackRotation = true;


    };
    Fire = function () {
        for (let i = 0; i <= this.pellet; i++) {
            if (this.weapon.fireRate > 0)
                this.state.timer.add(this.weapon.fireRate * i, this.Shoot, this);
            else
                this.Shoot();
        }
        this.canShoot = false;
        this.state.timer.add(this.fireInterval, this.restoreInterval, this);
    };
    Shoot = function () {
        this.weapon.fire();
    };

    getBullets = function () {
        return this.weapon.bullets;
    };

    shootRight = function (playerSprite) {
        this.weapon.bulletSpeed = 1000;
        this.weapon.bulletAngleOffset = 0;
        this.weaponTracking(true, playerSprite);
    };
    shootLeft = function (playerSprite) {
        this.weapon.bulletSpeed = -1000;
        this.weapon.fireAngle = Phaser.ANGLE_LEFT;
        this.weapon.bulletAngleOffset = 180;
        this.weaponTracking(false, playerSprite);
    };
    isShooting = function () {
        if (this.fireButton.isDown)
            return true;
        else
            return false;
    };
    isShotReleased = function () {
        let released = false;
        released = this.state.input.keyboard.upDuration(this.fireButton);
        if (released)
            this.state.input.activePointer.justReleased();
        return released;
    };


    weaponTracking = function (right, playerSprite) {
        if (right)
            this.weapon.trackSprite(playerSprite, 26, -8, true);
        else
            this.weapon.trackSprite(playerSprite, -26, -8, true);
    };
    restoreInterval = function () {
        this.canShoot = !this.canShoot;

    };
}