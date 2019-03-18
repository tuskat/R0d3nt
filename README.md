# Phaser NPM Webpack TypeScript Starter Project (catchy name, isn't it?)

![PhaserNPMWebpackTypeScriptStarterProject](https://raw.githubusercontent.com/rroylance/phaser-npm-webpack-typescript-starter-project/master/README_HEADER.png)

### [Visit the itch.io page for a live demo!][itchio]

##### Hit the ground running and make some great games!

###### If you use this template/starter project in any capacity; I'd love to hear about your experience with it. Whether you continued with it or decided not to (I really want to hear why you made your decision).

# Features:

- Phaser-CE 2.7.3 (npm module, no having to download the library separately...)
- TypeScript + TSLint
- 3 States (Boot, Preloader, Title) showing transition between states and where some things should be done and how a TypeScript state looks
- Google Web Font loader
- Webpack
- Separate Development and Distribution builds
- Live server (builds and reloads the browser on changes)
- No hassle asset management requiring no code, on your part, to load and parse assets
  - Assets are required and hashed via webpack, you can now guarantee that when you push an update, everyone will get the new files and not cached ones
  - Assets class created automatically allowing you to access all the assets and their frames and sprites (in the case of Atlases and Audiosprites) in a compiler validating way!
- Setting up the game size and scaling through a script that does it all for you
  - Automatic template background
  - Sets up the size the game so that it is scaled only when absolutely necessary 
  - Refer to src/utils/utils.ts for an explanation on the background_template and the sizing/scaling style

### TODO:

- Clean up generateAssetsClass.js
- Get Custom/Local Web Fonts hashed by Webpack (to avoid cache issues)
  - If anyone has experience webpacking font-face in css style web fonts and loading said fonts via webfontloader, let me know as I was having some trouble getting the font-face src to use the hashed assets.
- Multiple resolution asset loader (@2x, @3x, etc...)
- Yeoman Generator
- Optional Analytics integration
- Optional Cordova integration for iOS and Android builds

# Setup:
To use this you’ll need to install a few things before you have a working copy of the project. But once you have node.js installed it only takes a few seconds and a couple commands to get going.

## 0. Install Git:

[GIT Installation Instructions and Links][git-scm]

## 1. Download or Clone this repo:

##### 1.1 Download:

Download the latest zip/tar.gz from [GitHub Releases][releases], extract it to where you want your project to be.

##### 1.2 Clone:

Navigate into your workspace directory.

Run:

```git clone https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project.git```

## 2. Install node.js and npm (npm is included and installed with node.js):

[NodeJS Installation Instructions and Links][nodejs]

## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install```

## 4. Run the dev server:

Run to use the dev build while developing:

```npm run server:dev```

Run to use the dist build while developing 

```npm run server:dist```

###### The only real reason I can think of to use the dist server is if the minification process is breaking something in your game and you need to test using the minified version, or something you excluded with the DEBUG flag shouldn't have been excluded.

This will run a server that serves your built game straight to the browser and will be built and reloaded automatically anytime a change is detected.

## Build for testing/developing/debugging:

Run:

```npm run build:dev```

This will build the game with a few caveats;
- A compile time flag, DEBUG, set to true; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.js will not be minified

## Build for release:

Run:

```npm run build:dist```

This will build the game with a few caveats;
- The compile time flag, DEBUG, set to false; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.min.js will be minified

## Generate Assets Class:

This project will manage your assets for you! All you need to do is drop your assets in assets/ (subdirectories do not matter) and run (you need to run this manually if you change assets while the server is running, otherwise it's run automatically when running a build);

```npm run assets```

or (if your dev GOOGLE_WEB_FONTS is different from your dist);

```npm run assets:dev```

src/assets.ts will be generated which contains sections for all your asset types (the generator is smart enough to distinguish what assets are what !) and classes for every asset, it will also generate an enum containing every frame and sprite in Atlases and AudioSprites respectively! 

No need to remember keys, frames, or sprites anymore; which means no more typos resulting in asset not found errors. Just use, for example, Assets.Images.ImagesBackgroundTemplate.getName() or Assets.Audiosprites.AudiospritesSfx.Sprites.Laser1. This also allows the compiler to warn you if you are trying to use an asset that doesn't exist!

The preloader will use this class to load everything, **you don't have to do anything in code to get your assets loading and available (except for any assets you need for your loading screen...)**!

Currently supports the following (if you need a new extension or find an issue with one of your assets not exporting correctly, just let me know);

- Images:
  - bmp, gif, jpg, jpeg, png, webp
- Atlases:
  - bmp, gif, jpg, jpeg, png, webp
  - json (the loader figures out if it's a JSONArray or JSONHash, no need to remember or care), xml
- Audio:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
- Audiosprites:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
  - json
- Local Fonts:
  - eot, otf, svg, ttf, woff, woff2
  - css
- Bitmap Font:
  - bmp, gif, jpg, jpeg, png, webp
  - xml, fnt
- JSON:
  - json
- XML:
  - xml
- Text:
  - txt
  
Which version of the audio to load is defined in the webpack.dev.config.js and webpack.dist.config.js under the DefinePlugin 'SOUND_EXTENSIONS_PREFERENCE' section;
- Currently I set the order to: webm, ogg, m4a, mp3, aac, ac3, caf, flac, mp4, wav
- The loader will load the audio using this as the preference; the first supported file that is found is used using the order of this list as most preferred to least preferred

## Change the game size and generate a template background:

Note: This is automatically run after running npm install, however you may want to run it again (if you deleted the background.png and want it back, or if you want to change the game size from the default).

Run:

```npm run setupGameSize```

This will run a script that will generate a template background showing the safe and decoration area of your game when it is sized or scaled for different devices as well as updating a couple global values in the webpack configs so that the game knows about the new size when built.

If you do not want the default 800 x 500 with this scaling style, run the following and all will be updated.

**DO NOT MODIFY THE (DEFAULT or MAX)\_GAME\_(WIDTH or HEIGHT) OR SCALE_MODE PLUGINS DEFINED IN THE WEBPACK CONFIGS, OR THIS WILL NOT WORK**;

Run the following for descriptions and default values for all possible options;
```node ./scripts/setupGameSize -h```

Run the following specifying some or all of the options;
```node ./scripts/setupGameSize --width [whatever width you want] --height [whatever height you want] --aspect-ratio [If you want a different default aspect ratio] --scale-mode [one of the Phaser Scale Modes] [--no-png]```

You can either provide the width **and** height (defaults 800 and 500 respectively) and as long as they result in an aspect ratio of what's set in the script or by --aspect-ratio (default 1.6 or 16:10), or you can provide the width **or** height and the one you didn't provide will be calculated for you. 

Providing --scale-mode will set this.game.scale.scaleMode to the corresponding Phaser.ScaleManager.SCALE_MODE (default USER_SCALE).

If you do not want the background to be created just add the flag --no-png (not putting this will let the background generate).

## Google Web Fonts:

Add your desired Google Web Fonts to the webpack.dev.config.js and/or webpack.dist.config.js in the DefinePlugin 'GOOGLE_WEB_FONTS' section and they will then be loaded and available via Assets.GoogleWebFonts.

## Custom/Local Web Fonts:

Add your desired Custom/Local Web Fonts to your assets folder and they will then be loaded and available via Assets.CustomWebFonts
- The various font files, and the css MUST share the same name
- One CSS file per font

I recommend one of the following generators for generating your font files;
- [Font Squirrel Webfont Generator][fontsquirrel]
- [Everything Fonts font-face generator][everythingfonts]

## Bugs/Issues?

If you have any issues please let me know via [GitHub Issues][issues]!

## Requests/Suggestions?

If you have any requests or suggestion for the project please let me know via [GitHub Issues][issues]!

## Contributing Code?

If you would like to have some of your code included; whether a new feature, a cleaned up feature, a bugfix, or whatever. Please open up a [Pull Request][pulls]!

[issues]: https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project/issues
[pulls]: https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project/pulls
[releases]: https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project/releases
[fontsquirrel]: https://www.fontsquirrel.com/tools/webfont-generator
[everythingfonts]: https://everythingfonts.com/font-face
[git-scm]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[nodejs]: https://nodejs.org/en/
[itchio]: https://rroylance.itch.io/phaser-npm-webpack-typescript-starter-project
