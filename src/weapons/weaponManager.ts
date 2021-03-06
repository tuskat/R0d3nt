import Scene from '../states/gameScreenScene';

const enum WeaponsType {
    PISTOL = 0,
    SHOTGUN,
    SMG
}

export default class WeaponManager {
    scene: Scene = null;
    magazine: number = -1;
    pellet: number = 3;
    armory = [
        {
            magazine: -1,
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
            pellet: 12,
            fireInterval: 400,
            weapon: {
                type: WeaponsType.SHOTGUN,
                bulletKillType: Phaser.Weapon.KILL_LIFESPAN,
                bulletLifespan: 150,
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
    fireButton = [];
    canShoot = true;
    fireInterval: number = 0;
    constructor(scene) {
        this.scene = scene;
    }

    initWeapon() {
        this.initGun();
        if (this.fireButton.length === 0) {
            this.fireButton[0] = this.scene.input.keyboard.addKey(Phaser.KeyCode.X);
            this.fireButton[1] = this.scene.input.keyboard.addKey(Phaser.KeyCode.I);
        }
    }

    fireAction() {
        if (this.canShoot) {
            this.fire();
            return true;
        }
        return false;
    }

    initGun() {
        if (this.weapon) {
            this.weapon.destroy(true);
        }
        this.weapon = this.scene.game.add.weapon(100, 'my_bullet');
        this.weapon.bulletGravity = new Phaser.Point(-100, -1150);
        this.setGun(WeaponsType.PISTOL);
    }

    setGun(index) {
        this.magazine = this.armory[index].magazine;
        this.fireInterval = this.armory[index].fireInterval;
        let weapon = this.armory[index].weapon;
        Object.keys(weapon).map((key, i) => {
            this.weapon[key] = weapon[key];
        });
    }

    fire() {
        for (let i = 0; i < this.pellet; i++) {
            if (this.weapon.fireRate > 0) {
                if (i > 0) {
                    this.scene.timer.add((this.weapon.fireRate * i), this.shoot, this);
                } else {
                    this.shoot();
                }
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
        this.scene.timer.add(this.fireInterval, this.reload, this);
    }

    shoot() {
        this.weapon.fire();
        this.scene.soundManager.playSound('shoot');
    }

    getPistolBullets() {
        return this.weapon.bullets;
    }

    shootRight(playerSprite) {
        this.weapon.bulletSpeed = this.armory[this.weapon.type].weapon.bulletSpeed;
        this.weapon.bulletAngleOffset = 0;
        this.weaponTracking(true, playerSprite);
    }

    shootLeft(playerSprite) {
        this.weapon.bulletSpeed = -this.armory[this.weapon.type].weapon.bulletSpeed;
        this.weapon.bulletAngleOffset = 0;
        this.weaponTracking(false, playerSprite);
    }

    isShooting() {
        if (this.fireButton[0].isDown || this.fireButton[1].isDown) {
            if (this.isShotReleased()) {
                return false;
            }
            return true;
        }
        else
            return false;
    }

    isShotReleased() {
        let released = false;
        released = this.scene.input.keyboard.upDuration(this.fireButton[0], 1000);
        if (!released) {
            released = this.scene.input.keyboard.upDuration(this.fireButton[1], 1000);
        }
        if (released) {
            this.scene.input.activePointer.justReleased();
        }
        return false;
    }

    weaponTracking(right, playerSprite) {
        if (right)
            this.weapon.trackSprite(playerSprite, 26, -8, true);
        else
            this.weapon.trackSprite(playerSprite, 26, 8, true);
    }
    reload() {
        this.canShoot = !this.canShoot;
    }
}