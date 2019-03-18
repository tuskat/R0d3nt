import * as Assets from '../assets';

export default class PlayerAnimation {
    public sprite: Phaser.Sprite = null;
    private lastAnimation: string = null;
    constructor(sprite) {
        this.sprite = sprite;
    }
    initIdle = function () {
        this.sprite.animations.add('idle', [Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle4]);
    };

    initJump = function () {
        this.sprite.animations.add('jump', [Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump3]);
    };
    initFall = function () {
        let fall = this.sprite.animations.add('fall', [Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall3]);

        //   fall.onComplete.add(this.doneDoubleJump, this);
    };
    initRun = function () {
        this.sprite.animations.add('run', [Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun6]);



    };
    initShoot = function () {
        let shoot = this.sprite.animations.add('shoot', [Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot7,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot8,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot9]);

        shoot.onComplete.add(this.doneShooting, this);

        let runshoot = this.sprite.animations.add('runshoot', [Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot6]);

        shoot.onComplete.add(this.doneShooting, this);

        let airshot = this.sprite.animations.add('jumpshoot', [Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot7,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot8,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot9]);

        airshot.onComplete.add(this.doneAirShooting, this);
    };

    initSlash = function () {
        this.sprite.animations.add('slash', [Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash7,
        ]);

        this.sprite.animations.add('jumpslash', [Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash7,
        ]);
    };
    initWallClimb = function () {
        this.sprite.animations.add('wallclimb', [Assets.Atlases.AtlasesPlayerNinja.Frames.WallClimbWallClimb1]);
    };
    initPlayerAnimation = function () {
        this.initIdle();
        this.initJump();
        this.initFall();
        this.initRun();
        this.initShoot();
        this.initSlash();
        this.initWallClimb();
        this.sprite.animations.play('idle', 4, true);
    };
    playAnimation = function (animation, framerate = 30, loop = true) {
        if (animation !== this.lastAnimation) {
            let previousframe = this.sprite.animations.currentFrame;
            this.sprite.animations.play(animation, framerate, loop);
            this.swapRun(animation, previousframe);
            this.lastAnimation = animation;
            let frame = this.sprite.animations.currentFrame;
            this.setCollision(frame.sourceSizeW);
        }
    };
    swapRun = function (animation, previousframe) {
        if (animation === 'run') {
            let swapFrame = previousframe.name.match(/\d+/)[0];
            this.sprite.animations.currentAnim.setFrame(swapFrame, true);
        }
    };
    setCollision = function (width, height = 178) {
        this.sprite.body.setSize(width, height, 0, 0);
        this.sprite.collisionChanged = false;
    };
    doneShooting = function () {
        this.sprite.shooting = false;
        this.playAnimation('idle', 4);
    };
    doneAirShooting = function () {
        this.sprite.shooting = false;
        this.playAnimation('jump', 2);
    };
    doneDoubleJump = function () {
        this.playAnimation('jump', 2);
    };
}