import * as Assets from '../assets';

export default class EnemyAnimation {
    public sprite: Phaser.Sprite = null;
    private lastAnimation: string = null;
    constructor(sprite) {
        this.sprite = sprite;
    }
    initIdle() {
        this.sprite.animations.add('idle', [Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle4]);
    };

    initRun() {
        this.sprite.animations.add('run', [Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun4,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun5,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun6]);
    };

    initSlash() {
        let anim = this.sprite.animations.add('slash', [Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash4,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash5,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash6,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash7,
        ]);
        anim.enableUpdate = true;
        anim.onUpdate.add(this.slashing, this);
        anim.onComplete.add(this.doneSlashing, this);
    };

    initAnimation() {
        this.initIdle();
        this.initRun();
        this.initSlash();

        this.sprite.animations.play('idle', 4, true);
    };

    playAnimation(animation, framerate = 30, loop = true, immovable = false) {
        if (animation !== this.lastAnimation) {
            this.sprite.animations.play(animation, framerate, loop);
            this.lastAnimation = animation;
            let frame = this.sprite.animations.currentFrame;
            this.setCollision(frame.sourceSizeW);
            if (immovable) {
                this.sprite.body.allowGravity = false;
            } else {
                this.sprite.body.allowGravity = true;
            }
            this.sprite.body.immovable = immovable;
        }
    };

    setCollision(width, height = 178) {
        this.sprite.body.setSize(width, height, 0, 0);
    };

    doneSlashing() {
        this.playAnimation('idle', 4, true);
    };

    slashing(anim, frame) {
        if (frame.index >= 19) {
            this.setCollision(frame.sourceSizeW);
        }
    };
}