import * as Assets from '../assets';

const enum Status {
    IDLE = 1,
    CHASE,
    CONFUSED,
    ATTACKING,
    DEAD
};

export default class EnemyAnimation {
    public sprite: Phaser.Sprite = null;
    private lastAnimation: string = null;
    constructor(sprite) {
        this.sprite = sprite;
    }
    initIdle = function () {
        this.sprite.animations.add('idle', [Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.IdleIdle4]);
    };



    initRun = function () {
        this.sprite.animations.add('run', [Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun4,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun5,
        Assets.Atlases.AtlasesEnemyNinja.Frames.RunRun6]);
    };


    initSlash = function () {
      let slash = this.sprite.animations.add('slash', [Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash1,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash2,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash3,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash4,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash5,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash6,
        Assets.Atlases.AtlasesEnemyNinja.Frames.SlashSlash7,
        ]);

        slash.onComplete.add(this.doneSlashing, this);
    };

    initAnimation = function () {
        this.initIdle();
        this.initRun();
        this.initSlash();

        this.sprite.animations.play('idle', 4, true);
    };
    playAnimation = function (animation, framerate = 30, loop = true) {
        if (animation !== this.lastAnimation) {
            this.sprite.animations.play(animation, framerate, loop);
            this.lastAnimation = animation;
            let frame = this.sprite.animations.currentFrame;
            this.setCollision(frame.sourceSizeW);
        }
    };

    setCollision = function (width, height = 178) {
        this.sprite.body.setSize(width, height, 0, 0);
        this.sprite.collisionChanged = false;
    };
       doneSlashing = function () {
        this.playAnimation('idle');
    };
}