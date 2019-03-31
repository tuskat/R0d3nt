import * as Assets from '../assets';
import Player from './player';

export default class PlayerAnimation {
    public sprite: Phaser.Sprite = null;
    public player: Player = null;
    private lastAnimation: string = null;
    constructor(sprite, player) {
        this.sprite = sprite;
        this.player = player;
    }
    initIdle() {
        this.sprite.animations.add('idle', [Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle4]);
    };

    initJump() {
        this.sprite.animations.add('jump', [Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump3]);
    };

    initRun() {
        this.sprite.animations.add('run', [Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun6]);
    };

    initShoot() {
        let shoot = this.sprite.animations.add('shoot', [
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot7]);

        shoot.onComplete.add(this.doneShooting, this);

        let runshoot = this.sprite.animations.add('runshoot', [
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot6]);

        shoot.onComplete.add(this.doneShooting, this);

        let airshot = this.sprite.animations.add('jumpshoot', [
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot7,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot8,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot9]);

        airshot.onComplete.add(this.doneAirShooting, this);
    };

    initSlash() {
        this.sprite.animations.add('slash', [
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.SlashSlash7,
        ]);

        this.sprite.animations.add('jumpslash', [
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash6,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpSlashJumpSlash7,
        ]);
    };
    initWallClimb() {
        this.sprite.animations.add('wallclimb', [Assets.Atlases.AtlasesPlayerNinja.Frames.WallClimbWallClimb1]);
    };
    initPlayerAnimation() {
        this.initIdle();
        this.initJump();
        this.initRun();
        this.initShoot();
        this.initSlash();
        this.initWallClimb();
        this.sprite.animations.play('idle', 4, true);
    };
    playAnimation(animation, framerate = 30, loop = true) {
        this.setCollision();
        if (animation !== this.lastAnimation) {
            let previousframe = this.sprite.animations.currentFrame;
            this.sprite.animations.play(animation, framerate, loop);
            this.swapRun(animation, previousframe);
            this.lastAnimation = animation;
        }
    };
    swapRun(animation, previousframe) {
        if (animation === 'run') {
            let swapFrame = previousframe.name.match(/\d+/)[0];
            this.sprite.animations.currentAnim.setFrame(swapFrame, true);
        }
    };
    setCollision(width = 80, height = 176) {
        this.sprite.body.setSize(width, height, 8, 0);
    };
    doneShooting() {
        this.player.shooting = false;
        this.playAnimation('idle', 4);
    };
    doneAirShooting() {
        this.player.shooting = false;
        this.playAnimation('jump', 2);
    };
    doneDoubleJump() {
        this.playAnimation('jump', 2);
    };
}