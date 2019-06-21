
        PreloadBar = <any>'preload_bar.png',
        PreloadFrame = <any>'preload_frame.png',
    }
    export class AtlasesPreloadSpritesHash {
        static getName(): string { return 'preload_sprites_hash'; };

        static getJSONHash(): string { return require('assets/atlases/preload_sprites_hash.json'); };

        static getPNG(): string { return require('assets/atlases/preload_sprites_hash.png'); };

        static Frames = AtlasesPreloadSpritesHashFrames;
    }
    enum AtlasesPreloadSpritesXmlFrames {
        PreloadBar = <any>'preload_bar.png',
        PreloadFrame = <any>'preload_frame.png',
    }
    export class AtlasesPreloadSpritesXml {
        static getName(): string { return 'preload_sprites_xml'; };

        static getPNG(): string { return require('assets/atlases/preload_sprites_xml.png'); };

        static getXML(): string { return require('assets/atlases/preload_sprites_xml.xml'); };

        static Frames = AtlasesPreloadSpritesXmlFrames;
    }
    enum AtlasesSlasherNinjaFrames {
        Death00 = <any>'Death/000.png',
        Death01 = <any>'Death/001.png',
        Death02 = <any>'Death/002.png',
        Death03 = <any>'Death/003.png',
        Death04 = <any>'Death/004.png',
        Idle00 = <any>'Idle/000.png',
        Idle01 = <any>'Idle/001.png',
        Idle02 = <any>'Idle/002.png',
        Idle03 = <any>'Idle/003.png',
        Run00 = <any>'Run/000.png',
        Run01 = <any>'Run/001.png',
        Run02 = <any>'Run/002.png',
        Run03 = <any>'Run/003.png',
        Run04 = <any>'Run/004.png',
        Run05 = <any>'Run/005.png',
        Slash00 = <any>'Slash/000.png',
        Slash01 = <any>'Slash/001.png',
        Slash02 = <any>'Slash/002.png',
        Slash03 = <any>'Slash/003.png',
        Slash04 = <any>'Slash/004.png',
        Slash05 = <any>'Slash/005.png',
        Slash06 = <any>'Slash/006.png',
    }
    export class AtlasesSlasherNinja {
        static getName(): string { return 'slasher_ninja'; };

        static getJSONArray(): string { return require('assets/atlases/slasher_ninja.json'); };

        static getPNG(): string { return require('assets/atlases/slasher_ninja.png'); };

        static Frames = AtlasesSlasherNinjaFrames;
    }
}

export namespace Audio {
    export class AudioClear {
        static getName(): string { return 'clear'; };

        static getOGG(): string { return require('assets/audio/clear.ogg'); };
    }
    export class AudioDash {
        static getName(): string { return 'dash'; };

        static getOGG(): string { return require('assets/audio/dash.ogg'); };
    }
    export class AudioDie {
        static getName(): string { return 'die'; };

        static getOGG(): string { return require('assets/audio/die.ogg'); };
    }
    export class AudioEnemyHit {
        static getName(): string { return 'enemy-hit'; };

        static getOGG(): string { return require('assets/audio/enemy-hit.ogg'); };
    }
    export class AudioEnemyRun {
        static getName(): string { return 'enemy-run'; };

        static getOGG(): string { return require('assets/audio/enemy-run.ogg'); };
    }
    export class AudioExplosion {
        static getName(): string { return 'explosion'; };

        static getOGG(): string { return require('assets/audio/explosion.ogg'); };
    }
    export class AudioHit {
        static getName(): string { return 'hit'; };

        static getOGG(): string { return require('assets/audio/hit.ogg'); };
    }
    export class AudioJump {
        static getName(): string { return 'jump'; };

        static getOGG(): string { return require('assets/audio/jump.ogg'); };
    }
    export class AudioPauseIn {
        static getName(): string { return 'pause_in'; };

        static getOGG(): string { return require('assets/audio/pause_in.ogg'); };
    }
    export class AudioPauseOut {
        static getName(): string { return 'pause_out'; };

        static getOGG(): string { return require('assets/audio/pause_out.ogg'); };
    }
    export class AudioPowerup {
        static getName(): string { return 'powerup'; };

        static getOGG(): string { return require('assets/audio/powerup.ogg'); };
    }
    export class AudioRun {
        static getName(): string { return 'run'; };

        static getOGG(): string { return require('assets/audio/run.ogg'); };
    }
    export class AudioShoot {
        static getName(): string { return 'shoot'; };

        static getOGG(): string { return require('assets/audio/shoot.ogg'); };
    }
    export class AudioSlash {
        static getName(): string { return 'slash'; };

        static getOGG(): string { return require('assets/audio/slash.ogg'); };
    }
    export class MusicBawsImaginaryFunerals {
        static getName(): string { return 'baws_imaginary_funerals'; };

        static getOGG(): string { return require('assets/music/baws_imaginary_funerals.ogg'); };
    }
    export class MusicBawsSirens {
        static getName(): string { return 'baws_sirens'; };

        static getOGG(): string { return require('assets/music/baws_sirens.ogg'); };
    }
    export class MusicBawsWaves {
        static getName(): string { return 'baws_waves'; };

        static getOGG(): string { return require('assets/music/baws_waves.ogg'); };
    }
}

export namespace Audiosprites {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace GoogleWebFonts {
    export const Barrio: string = 'Barrio';
}

export namespace CustomWebFonts {
    export class Fonts2DumbWebfont {
        static getName(): string { return '2Dumb-webfont'; };

        static getFamily(): string { return '2dumbregular'; };

        static getCSS(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.css'); };
        static getEOT(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.eot'); };
        static getSVG(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.svg'); };
        static getTTF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.ttf'); };
        static getWOFF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/2Dumb-webfont.woff'); };
    }
    export class FontsHavanaHavana {
        static getName(): string { return 'Havana'; };

        static getFamily(): string { return 'Havana'; };

        static getCSS(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/Havana/Havana.css'); };
        static getTTF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/Havana/Havana.ttf'); };
    }
    export class FontsVCROSDMONOVCROSDMONO {
        static getName(): string { return 'VCR_OSD_MONO'; };

        static getFamily(): string { return 'VCR_OSD'; };

        static getCSS(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/VCR_OSD_MONO/VCR_OSD_MONO.css'); };
        static getTTF(): string { return require('!file-loader?name=assets/fonts/[name].[ext]!assets/fonts/VCR_OSD_MONO/VCR_OSD_MONO.ttf'); };
    }
}

export namespace BitmapFonts {
    export class FontsFontFnt {
        static getName(): string { return 'font_fnt'; };

        static getFNT(): string { return require('assets/fonts/font_fnt.fnt'); };
        static getPNG(): string { return require('assets/fonts/font_fnt.png'); };
    }
    export class FontsFontXml {
        static getName(): string { return 'font_xml'; };

        static getPNG(): string { return require('assets/fonts/font_xml.png'); };
        static getXML(): string { return require('assets/fonts/font_xml.xml'); };
    }
}

export namespace JSON {
    export class LevelsHardMap10 {
        static getName(): string { return 'map10'; };

        static getJSON(): string { return require('assets/levels/hard/map10.json'); };
    }
    export class LevelsHardMap11 {
        static getName(): string { return 'map11'; };

        static getJSON(): string { return require('assets/levels/hard/map11.json'); };
    }
    export class LevelsHardMap12 {
        static getName(): string { return 'map12'; };

        static getJSON(): string { return require('assets/levels/hard/map12.json'); };
    }
    export class LevelsHardMap13 {
        static getName(): string { return 'map13'; };

        static getJSON(): string { return require('assets/levels/hard/map13.json'); };
    }
    export class LevelsHardMap14 {
        static getName(): string { return 'map14'; };

        static getJSON(): string { return require('assets/levels/hard/map14.json'); };
    }
    export class LevelsHardMap15 {
        static getName(): string { return 'map15'; };

        static getJSON(): string { return require('assets/levels/hard/map15.json'); };
    }
    export class LevelsHardMap7 {
        static getName(): string { return 'map7'; };

        static getJSON(): string { return require('assets/levels/hard/map7.json'); };
    }
    export class LevelsHardMap8 {
        static getName(): string { return 'map8'; };

        static getJSON(): string { return require('assets/levels/hard/map8.json'); };
    }
    export class LevelsHardMap9 {
        static getName(): string { return 'map9'; };

        static getJSON(): string { return require('assets/levels/hard/map9.json'); };
    }
    export class LevelsHub {
        static getName(): string { return 'hub'; };

        static getJSON(): string { return require('assets/levels/hub.json'); };
    }
    export class LevelsMap1 {
        static getName(): string { return 'map1'; };

        static getJSON(): string { return require('assets/levels/map1.json'); };
    }
    export class LevelsMap2 {
        static getName(): string { return 'map2'; };

        static getJSON(): string { return require('assets/levels/map2.json'); };
    }
    export class LevelsMap3 {
        static getName(): string { return 'map3'; };

        static getJSON(): string { return require('assets/levels/map3.json'); };
    }
    export class LevelsMap4 {
        static getName(): string { return 'map4'; };

        static getJSON(): string { return require('assets/levels/map4.json'); };
    }
    export class LevelsMap5 {
        static getName(): string { return 'map5'; };

        static getJSON(): string { return require('assets/levels/map5.json'); };
    }
    export class LevelsMap6 {
        static getName(): string { return 'map6'; };

        static getJSON(): string { return require('assets/levels/map6.json'); };
    }
}

export namespace XML {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Text {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}

export namespace Misc {
    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}
}
