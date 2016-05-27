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

  startPreload() {
    if(this.preloadQueue) {
      this.load(this.preloadQueue, this.preloadCount, this.preloadProgressCallback);
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

  load(queue, count) {
    for(let asset of queue) {
      var t = this.loadAsset(asset.src, asset.type);
      t.then(() => {
        this.progressHandler(queue, count)
      })
      .catch(() => {
        this.errorHandler(asset.src);
      });
    }
  }

  loadAsset(path, type) {
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

  progressHandler(queue, count, handler) {
    count++;
 
    if(this.preloadProgressCallback) {
      const data = {
        completed: count,
        total: queue.length,
        percentage: Math.round(((count / queue.length) * 100))
      };
      // this.preloadProgressCallback(data);
      handler(data);
    }

    if(count == queue.length) {
      this.preloadCompletedHandler();
    }
  }

  errorHandler(src) {
    this.resetAllCallbacks();
    this.preloadQueue = null;
    this.backgroundQueue = null;
    throw "Cannot find file " + src;
  }




  backgroundProgressHandler() {
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

  resetAllCallbacks() {
    this.preloadProgressCallback =  null;
    this.preloadCompletedCallback =  null;

    this.backgroundProgressCallback = null;
    this.backgroundCompletedCallback = null;
  }
}

module.exports = LBLoader;