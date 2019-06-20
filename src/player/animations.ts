import * as Assets from '../assets';
import Player from './player';
import Scene from '../states/gameScreenScene';

export default class PlayerAnimation {
    public sprite: Phaser.Sprite = null;
    public player: Player = null;
    public scene: Scene = null;
    private lastAnimation: string = null;
    constructor(sprite, player) {
        this.sprite = sprite;
        this.player = player;
        this.scene = player.scene;
    }
    initIdle() {
        this.sprite.animations.add('idle', [Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.IdleIdle4]);
    };

    initJump() {
        let jump = this.sprite.animations.add('jump', [Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.JumpJump3]);
        jump.onStart.add(this.jumpingSound, this);
        jump.onComplete.add(this.doneJumping, this);
    };

    initFall() {
        this.sprite.animations.add('fall', [Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.FallFall3]);
    };

    initRun() {
        let anim = this.sprite.animations.add('run', [Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.RunRun6]);

        anim.enableUpdate = true;
        anim.onUpdate.add(this.runningSound, this);
    };

    initDash() {
        let dash = this.sprite.animations.add('dash', [Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash1,
        Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash2,
        Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash3,
        Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash4,
        Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash5,
        Assets.Atlases.AtlasesPlayerNinja.Frames.DashDash6]);
        dash.onStart.add(this.startDashing, this);
        dash.onComplete.add(this.doneDashing, this);
    };

    initShoot() {
        let shoot = this.sprite.animations.add('shoot', [
            Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot5,
            Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot6,
            Assets.Atlases.AtlasesPlayerNinja.Frames.ShootShoot7]);
        let runshoot = this.sprite.animations.add('runshoot', [
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot1,
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot2,
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot3,
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot4,
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot5,
            Assets.Atlases.AtlasesPlayerNinja.Frames.RunShootRunShoot6]);
        let airshoot = this.sprite.animations.add('jumpshoot', [
            Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot5,
            Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot6,
            Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot7,
            Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot8,
            Assets.Atlases.AtlasesPlayerNinja.Frames.JumpShootJumpShoot9]);

        runshoot.enableUpdate = true;
        runshoot.onUpdate.add(this.runningSound, this);

        shoot.onComplete.add(this.doneShooting, this);
        airshoot.onComplete.add(this.doneAirShooting, this);
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
        this.initFall();
        this.initRun();
        this.initShoot();
        this.initDash();
        this.initSlash();
        this.initWallClimb();
        this.sprite.animations.play('idle', 4, true);
    };
    playAnimation(animation, framerate = 30, loop = true) {
        if (animation !== this.lastAnimation) {
            let previousframe = this.sprite.animations.currentFrame;
            this.sprite.animations.play(animation, framerate, loop);
            this.lastAnimation = animation;
        }
        this.setCollision();
    };

    setCollision(width = 80, height = 176, offsetY = 0) {
        let sourceWidth = this.sprite.animations.currentFrame.sourceSizeW;
        let offsetX = (sourceWidth > 80) ? (sourceWidth * 0.40) : 0;
        this.sprite.body.setSize(width, height, offsetX, offsetY);
    };
    startDashing() {
        this.setCollision(80, 160);
    }
    doneDashing() {
        if (this.sprite.body.touching.down) {
            this.playAnimation('run');
        } else {
            this.playAnimation('fall', 2);
        }
        this.setCollision();
    };
    doneShooting() {
        this.player.shooting = false;
        this.playAnimation('idle', 4);
    };
    doneAirShooting() {
        this.player.shooting = false;
        this.playAnimation('fall', 2);
    };
    jumpingSound() {
        this.scene.soundManager.playSound('jump');
    };
    doneJumping() {
        this.playAnimation('fall', 3);
        this.setCollision();
    };
    runningSound(anim, frame) {
        let playSound = (frame.index === 44 || frame.index === 52);
        if (playSound && this.sprite.body.touching.down) {
            this.scene.soundManager.playSound('run');
        }
    };
}