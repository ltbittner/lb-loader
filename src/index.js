let instance = null;

class LBLoader {
  constructor(args = {}) {
    if(instance) {
      return instance;
    }
    instance = this;

    if(args.preload) {
      this.preloadQueue = [];
      this.preloadProgressCallback = args.preloadProgressCallback || null;
      this.preloadCompletedCallback = () => {
        if(args.preloadCompletedCallback) {
          args.preloadCompletedCallback();
        }
        if(args.autoStartBackgroundLoad === true) {
          this.startBackgroundLoad();
        }
        if(!args.backgroundLoad) {
          this.destroy();
        }
      };
      this.initializeQueue(args.preload, this.preloadQueue);
    }

    if(args.backgroundLoad) {
      this.backgroundLoadQueue = [];
      this.backgroundLoadProgressCallback = args.backgroundLoadProgressCallback || null;
      this.backgroundLoadCompletedCallback = () => {
        if(args.backgroundLoadCompletedCallback) {
          args.backgroundLoadCompletedCallback();
        }
        this.destroy();
      };
      this.initializeQueue(args.backgroundLoad, this.backgroundLoadQueue);
    }
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
        this.destroy();
        console.error(new Error('Unable to handle \'' + src + '\'. File format is not supported.'));
        return;
      }
    }
  }

  loadAssets(queue, progressCallback, completeCallback) {
    let count = 0;
    for(let asset of queue) {
      this.loadAsset(asset.src, asset.type).then(() => {
        count++;
        if(progressCallback) {
          this.progressHandler(queue, count, progressCallback);  
        }
        if(count == queue.length) {
          completeCallback();
        }
      }).catch(() => {
        this.errorHandler(asset.src);
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
      if(type == 'video') {
        asset.load();
      }
    });
  }

  progressHandler(queue, count, progressCallback) {
    progressCallback({
      completed: count,
      total: queue.length,
      percentage: Math.round(((count / queue.length) * 100))
    });
  }

  errorHandler(src) {
    this.destroy();
    console.error(new Error('\'' + src + '\' is not found.'));
  }

  destroy() {
    this.preloadQueue = [];
    this.preloadProgressCallback =  null;
    this.preloadCompletedCallback =  null;
    this.backgroundLoadQueue = [];
    this.backgroundProgressCallback = null;
    this.backgroundCompletedCallback = null;
    instance = null;
  }
}

module.exports = LBLoader;