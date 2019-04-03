import Scene from '../states/gameScreenScene';

const enum WeaponsType {
    PISTOL = 0,
    SHOTGUN,
    SMG
};

export default class WeaponManager {
    state: Scene = null;
    magazine: number = -1;
    pellet: number = 3;
    armory = [
        {
            magazine: 3,
            pellet: 3,
            fireInterval: 500,
            weapon: {
                type: WeaponsType.PISTOL,
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 500,
                bulletSpeed: 1000,
                bulletAngleOffset: 0,
                bulletAngleVariance: 0,
                fireRate: 50,
                autoFire: false,
                bulletWorldWrap: false,
                enableBody: true,
                trackRotation: true
            }
        },
        {
            magazine: 10,
            pellet: 5,
            fireInterval: 400,
            weapon: {
                type: WeaponsType.SHOTGUN,
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 100,
                bulletSpeed: 2000,
                bulletAngleOffset: 0,
                bulletAngleVariance: 10,
                fireRate: 0,
                autoFire: false,
                bulletWorldWrap: false,
                enableBody: true,
                trackRotation: true
            }
        },
        {
            magazine: 10,
            pellet: 10,
            fireInterval: 500,
            weapon: {
                type: WeaponsType.SMG,
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 500,
                bulletSpeed: 1000,
                bulletAngleOffset: 0,
                bulletAngleVariance: 1,
                fireRate: 75,
                autoFire: true,
                bulletWorldWrap: false,
                enableBody: true,
                trackRotation: true
            }
        }
    ];
    weapon = null;
    fireButton = null;
    canShoot = true;
    fireInterval: number = 0;
    constructor(state) {
        this.state = state;
    }

    initWeapon(shootKey = Phaser.KeyCode.X) {
        this.initGun();
        this.fireButton = this.state.input.keyboard.addKey(shootKey);
    };

    fireAction() {
        if (this.canShoot) {
            this.fire();
            return true;
        }
        return false;
    };

    initGun() {
        this.weapon = this.state.game.add.weapon(30, 'my_bullet');
        this.weapon.bulletGravity = new Phaser.Point(-100, -1150);
        this.setGun(WeaponsType.PISTOL);
    };

    setGun(index) {
        this.magazine = this.armory[index].magazine;
        this.fireInterval = this.armory[index].fireInterval;
        let weapon = this.armory[index].weapon;
        Object.keys(weapon).map((key, i) => {
            this.weapon[key] = weapon[key];
        });
    }

    fire() {
        for (let i = 0; i <= this.pellet; i++) {
            if (this.weapon.fireRate > 0) {
                this.state.timer.add(this.weapon.fireRate * i, this.shoot, this);
            } else {
               this.shoot();
            }
        }
        this.canShoot = false;
        if (this.weapon.type !== WeaponsType.PISTOL) {
            this.magazine -= 1;
            if (this.magazine === 0) {
                this.setGun(WeaponsType.PISTOL);
            }
        }
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