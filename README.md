# lb-loader
[![npm version][npm-img]][npm-url]

A preloader and background loader rolled into one.

### Install
```sh
npm install lb-loader
```

### Example
```sh
git clone https://github.com/ltbittner/lb-loader.git
cd lb-loader
npm install
npm start
```
The example will run at http://localhost:3000. For source code of the example, please refer to [example.js](example/example.js).

## Constructor
An object with following keys are passed as a parameter:
* `preload` (array, optional) - strings contain paths of the assets to be preloaded.
* `preloadProgressCallback` (function, optional) - callback function when each asset is done preloading. Contains three properties:
    * `index` - index of the asset that has been preloaded
    * `total` - total number of assets in the preload queue
    * `percentage` - index / total * 100
* `preloadCompletedCallback` (function, optional) - callback function when all assets are done preloading.
* `backgroundLoad` (array, optional) - strings contain paths of the assets to be loaded in background.
* `backgroundLoadProgressCallback` (function, optional) - callback function when each asset is done loading in background. Contains three properties:
    * `index` - index of the asset that has been loaded
    * `total` - total number of assets in the background-load queue
    * `percentage` - index / total * 100
* `backgroundLoadCompletedCallback` (function, optional) - callback function when all assets are done loading in background.
* `autoStartBackgroundLoad` (boolean, optional) - option to start background-load when preload is done. Default is `false`.
* `sequential` (boolean, optional) - Set to true if you want to wait for the current asset to finish loading before the next one. Default is `false`.

## Methods
### startPreload()
Starts preloading. An error occurs if preload queue is empty.

### startBackgroundLoad()
Starts background-loading. An error occurs if background-load queue is empty.

### destroy()
Cleans everything and destroys the loader instance. This method is called automatically when all loading sequences are completed.

## License
MIT - please refer to [LICENSE](LICENSE).

[npm-url]: https://www.npmjs.org/package/lb-loader
[npm-img]: https://img.shields.io/npm/v/lb-loader.svg
