let instance = null;

class LBLoader {
  constructor(args = {}) {
    if(instance) {
      return instance;
    }
    instance = this;

    if(args.preload) {
      this.preloadQueue = [];

      if(this.isValid(args.preload, 'array')) {
        this.initializeQueue(args.preload, this.preloadQueue);
      } else {
        this.throwTypeError('preload', 'array');
      }

      this.preloadProgressCallback = () => null;
      if(this.isValid(args.preloadProgressCallback, 'function')) {
        this.preloadProgressCallback = args.preloadProgressCallback;
      } else if(args.preloadProgressCallback) {
        this.throwTypeError('preloadProgressCallback', 'function');
      }

      let f1 = () => null;
      if(this.isValid(args.preloadCompletedCallback, 'function')) {
        f1 = args.preloadCompletedCallback;
      } else if(args.preloadCompletedCallback) {
        this.throwTypeError('preloadCompletedCallback', 'function');
      }

      let f2 = () => null;
      if(args.autoStartBackgroundLoad === true) {
        f2 = this.startBackgroundLoad.bind(this);
      } else if(args.autoStartBackgroundLoad && !this.isValid(args.autoStartBackgroundLoad, 'boolean')) {
        this.throwTypeError('autoStartBackgroundLoad', 'boolean');
      }

      let f3 = () => null;
      if(!this.isValid(args.backgroundLoad, 'array')) {
        f3 = this.destroy.bind(this);
      }

      this.preloadCompletedCallback = () => {
        f1();
        f2();
        f3();
      };
    }

    if(args.backgroundLoad) {
      this.backgroundLoadQueue = [];

      if(this.isValid(args.backgroundLoad, 'array')) {
        this.initializeQueue(args.backgroundLoad, this.backgroundLoadQueue);
      } else {
        this.throwTypeError('backgroundLoad', 'array');
      }

      this.backgroundLoadProgressCallback = () => null;
      if(this.isValid(args.backgroundLoadProgressCallback, 'function')) {
        this.backgroundLoadProgressCallback = args.backgroundLoadProgressCallback;
      } else if(args.backgroundLoadProgressCallback) {
        this.throwTypeError('backgroundLoadProgressCallback', 'function');
      }

      let f1 = () => null;
      if(this.isValid(args.backgroundLoadCompletedCallback, 'function')) {
        f1 = args.backgroundLoadCompletedCallback;
      } else if(args.backgroundLoadCompletedCallback) {
        this.throwTypeError('backgroundLoadCompletedCallback', 'function');
      }

      this.backgroundLoadCompletedCallback = () => {
        f1();
        this.destroy();
      };
    }

    this.dev = args.dev || false;
  }

  startPreload() {
    if(!this.preloadQueue) {
      console.error(new Error('Assets to be preloaded are not defined.'));
      return;
    }
    this.loadAssets(this.preloadQueue, this.preloadProgressCallback, this.preloadCompletedCallback);
  }

  startBackgroundLoad() {
    if(!this.backgroundLoadQueue) {
      console.error(new Error('Assets to be loaded in the background are not defined.'));
      return;
    }
    this.loadAssets(this.backgroundLoadQueue, this.backgroundLoadProgressCallback, this.backgroundLoadCompletedCallback);
  }

  initializeQueue(args, queue) {
    for(let src of args) {
      let type;
      if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(src)) {
        type = 'image';
      } else if((/\.(mp3|ogg|wav)$/i).test(src)) {
        type = 'audio';
      } else if((/\.(mp4|webm)$/i).test(src)) {
        type = 'video';
      }
      if(type) {
        queue.push({ type, src });
      } else {
        console.error(new Error('Unable to handle \'' + src + '\'. File format is not supported.'));
      }
    }
  }

  loadAssets(queue, progressCallback, completeCallback) {
    let count = 0;
    for(let asset of queue) {
      this.loadAsset(asset.src, asset.type).then(() => {
        count++;
        this.progressHandler(queue, count, progressCallback);
        if(count == queue.length) {
          completeCallback();
        }
      }).catch(() => {
        count++;
        console.error(new Error('Error in loading \'' + asset.src + '\'.'));
      });
    }
  }

  loadAsset(src, type) {
    return new Promise((resolve, reject) => {
      let asset;
      if(type == 'image') {
        asset = new Image();
      } else {
        asset = document.createElement(type);
        asset.addEventListener('suspend', resolve);
      }
      asset.onload = resolve;
      asset.onerror = reject;
      asset.src = src;
      if(this.dev) {
        asset.src = src + '?_=' + (new Date().getTime());
      }
      if(type == 'video') {
        asset.load();
      }
    });
  }

  progressHandler(queue, count, progressCallback) {
    progressCallback({
      index: count,
      total: queue.length,
      percentage: Math.round(((count / queue.length) * 100))
    });
  }

  destroy() {
    this.preloadQueue = [];
    this.preloadProgressCallback = null;
    this.preloadCompletedCallback = null;
    this.backgroundLoadQueue = [];
    this.backgroundProgressCallback = null;
    this.backgroundCompletedCallback = null;
    instance = null;
  }

  isValid(e, type) {
    return {}.toString.call(e).toLowerCase().indexOf(type) > -1;
  }

  throwTypeError(e, type) {
    console.error(new TypeError('Type of ' + e + ' must be ' + type + '.'));
  }
}

module.exports = LBLoader;