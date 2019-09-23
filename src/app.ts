import 'p2';
import 'pixi';
import 'phaser';

import * as WebFontLoader from 'webfontloader';

import Boot from './states/bootScene';
import Preloader from './states/preloaderScene';
import Title from './states/titleScene';
import Scene from './states/gameScreenScene';
import End from './states/endScene';
import * as Utils from './utils/utils';
import * as Assets from './assets';
import sentryId from './sentryKey'; // add your own, or comment sentry if you don't have one
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: sentryId });

let game = null;
class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super(config);

        this.state.add('boot', Boot);
        this.state.add('preloader', Preloader);
        this.state.add('scene', Scene);
        this.state.add('title', Title);
        this.state.add('end', End);
        this.state.start('boot');

        window.addEventListener("resize", resize, false);
    }
}

function startApp(): void {
    let gameWidth: number = DEFAULT_GAME_WIDTH;
    let gameHeight: number = DEFAULT_GAME_HEIGHT;

    if (SCALE_MODE === 'USER_SCALE') {
        let screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.calculateScreenMetrics(gameWidth, gameHeight, MAX_GAME_WIDTH, MAX_GAME_HEIGHT);

        gameWidth = screenMetrics.gameWidth;
        gameHeight = screenMetrics.gameHeight;
    }

    // There are a few more options you can set if needed, just take a look at Phaser.IGameConfig
    let gameConfig: Phaser.IGameConfig = {
        width: gameWidth,
        height: gameHeight,
        renderer: Phaser.WEBGL,
        parent: '',
        resolution: 1
    };

    game = new App(gameConfig);
}

window.onload = () => {
    let webFontLoaderOptions: any = null;
    let webFontsToLoad: string[] = GOOGLE_WEB_FONTS;

    if (webFontsToLoad.length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.google = {
            families: webFontsToLoad
        };
    }

    if (Object.keys(Assets.CustomWebFonts).length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.custom = {
            families: [],
            urls: []
        };

        let allCustomWebFonts = (Assets.CustomWebFonts as any);

        for (let font in allCustomWebFonts) {
            webFontLoaderOptions.custom.families.push(allCustomWebFonts[font].getFamily());
            webFontLoaderOptions.custom.urls.push(allCustomWebFonts[font].getCSS());
        }
    }

    if (webFontLoaderOptions === null) {
        // Just start the game, we don't need any additional fonts
        startApp();
    } else {
        // Load the fonts defined in webFontsToLoad from Google Web Fonts, and/or any Local Fonts then start the game knowing the fonts are available
        webFontLoaderOptions.active = startApp;

        WebFontLoader.load(webFontLoaderOptions);
    }
};

function resize() {
    var height = window.innerHeight;
    var width = window.innerWidth;
   
    game.width = width;
    game.height = height;
    game.stage.bounds.width = width;
    game.stage.bounds.height = height;
   
    if (game.renderType === 1) {
      game.renderer.resize(width, height);
      Phaser.Canvas.setSmoothingEnabled(game.context, false);
    }
  } 