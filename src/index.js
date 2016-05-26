let instance = null;

class LBLoader {
  constructor(args = null) {
    if(instance) {
      return instance;
    }
    instance = this;

    if(args.preload){
      this.preloadQueue = [];
      this.preloadCount = 0;
      this.preloadProgressCallback = args.preloadProgressCallback || null;
      this.preloadCompletedCallback = args.preloadCompletedCallback || null;
      this.initializeQueue(args.preload, this.preloadQueue);
    }
    
    if(args.backgroundLoad) {
      this.backgroundLoadQueue = [];
      this.backgroundLoadCount = 0;
      this.backgroundProgressCallback = args.backgroundProgressCallback || null;
      this.backgroundCompletedCallback = args.backgroundCompletedCallback || null;
      this.autoStartBackgroundLoad = false || args.autoStartBackgroundLoad;
      this.initializeQueue(args.backgroundLoad, this.backgroundLoadQueue);
    }
  }

  startLoad() {
    if(this.preloadQueue){
      this.startPreload();
    }
  }

  initializeQueue(args, queue) {
    if(args == null || !args){
      return;
    }
    for(let asset of args) {
      if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(asset)) {
        queue.push({
          type: 'image',
          src: asset,
        });
      } else if((/\.(mp4|webm)$/i).test(asset)) {
        queue.push({
          type: 'video',
          src: asset
        });
      } else if((/\.(mp3|ogg|wav)$/i).test(asset)) {
        queue.push({
          type: 'audio',
          src: asset
        });
      }
    }
  }

  startPreload() {
    for(let asset of this.preloadQueue) {
      var t = this.preloadAsset(asset.src, asset.type);
      t.then(() => {
        this.preloadProgressHandler();
      })
      .catch(() => {
        this.errorHandler(asset.src);
      });
    }
  }

  startBackgroundLoad() {
    for(let asset of this.backgroundQueue) {
      var t = this.preloadAsset(asset.src, asset.type);
      t.then(() => {
        this.backgroundProgressHandler();
      })
      .catch((e) => {
        console.log(e);
        this.errorHandler(asset.src);
      });
    }
  }

  preloadAsset(path, type) {
    return new Promise((resolve, reject) => {
      let asset;
      if(type == 'image') {
        asset = new Image();
      } else if(type == 'video') {
        asset = document.createElement('video');
        asset.addEventListener('suspend', resolve);
      }
      else if(type == 'audio') {
        asset = document.createElement('audio');
        asset.addEventListener('suspend', resolve);
      }

      asset.onload = resolve;
      asset.onerror = reject;
      asset.src = path + "?_=" + (new Date().getTime());
      if(type == 'video' || type == 'audio') {
        asset.load();
      }
    });
  }


  preloadProgressHandler() {
    this.numberOfPreloadedAssets++;
 
    if(this.preloadProgressCallback) {
      let data = {
        completed: this.numberOfPreloadedAssets,
        total: this.totalNumberOfPreloadAssets,
        percentage: Math.round(((this.numberOfPreloadedAssets / this.totalNumberOfPreloadAssets) * 100))
      };

      this.preloadProgressCallback(data);
    }

    if(this.numberOfPreloadedAssets == this.totalNumberOfPreloadAssets) {
      this.preloadCompletedHandler();
    }
  }

  backgroundProgressHandler(progress) {
    this.numberOfBackgroundAssets++;
 
    if(this.backgroundProgressCallback) {
      let data = {
        completed: this.numberOfBackgroundAssets,
        total: this.totalNumberOfBackgroundAssets,
        percentage: Math.round(((this.numberOfBackgroundAssets / this.totalNumberOfBackgroundAssets) * 100))
      };
      this.backgroundProgressCallback(data);
    }

    if(this.numberOfBackgroundAssets == this.totalNumberOfBackgroundAssets) {
      this.backgroundCompletedHandler();
    }
  }

  preloadCompletedHandler() {
    if(this.preloadCompletedCallback) {
      this.preloadCompletedCallback();
    }
    if(this.autoStartBackgroundLoad) {
      this.startBackgroundLoad();
    }
  }

  backgroundCompletedHandler() {
    if(this.backgroundCompletedCallback) {
      this.backgroundCompletedCallback();
    }
    this.resetAllCallbacks();
  }

  errorHandler(asset) {
    this.resetAllCallbacks();
    this.preloadQueue = null;
    this.backgroundQueue = null;
    throw "Cannot find file " + asset;
  }

  resetAllCallbacks() {
    this.preloadProgressCallback =  null;
    this.preloadCompletedCallback =  null;

    this.backgroundProgressCallback = null;
    this.backgroundCompletedCallback = null;
  }
}

module.exports = LBLoader;