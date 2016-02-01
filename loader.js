let _loaderInstance = null;
class TBLoader {
  constructor(args = null){
    //Make a singleton instance
    if(!_loaderInstance) {
      _loaderInstance = this;
    }

    this.preloadQueue = null;
    this.backgroundQueue = null;

    this.totalNumberOfPreloadAssets = 0;
    this.numberOfPreloadedAssets = 0;

    this.totalNumberOfBackgroundAssets = 0;
    this.numberOfBackgroundAssets = 0;
    
    this.preloadProgressCallback = args.preloadProgressCallback || null;
    this.preloadCompletedCallback = args.preloadCompletedCallback || null;

    this.backgroundProgressCallback = args.backgroundProgressCallback || null;
    this.backgroundCompletedCallback = args.backgroundCompletedCallback || null;

    this.autoStartBackgroundLoad = false || args.autoStartBackgroundLoad;

    if(args.preload){
      this.initializePreloadQueue(args.preload);
    }
    
    if(args.backgroundLoad) {
      this.initializeBackgroundQueue(args.backgroundLoad);
    } 

    return _loaderInstance;
  }

  startLoad() {
    if(this.preloadQueue){
      this.startPreload();
    }
  }

  initializePreloadQueue(args) {
    if(args == null || !args){
      return;
    }

    this.preloadQueue = [];
    for(let asset of args) {
      if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(asset)) {
        this.preloadQueue.push({
          type: 'image',
          src: asset,
        });
      } else if((/\.(mp4|webm)$/i).test(asset)) {
        this.preloadQueue.push({
          type: 'video',
          src: asset
        });
      }

      this.totalNumberOfPreloadAssets++;
    }
  }

  initializeBackgroundQueue(args) {

    if(args == null || !args){
      return; 
    }

    this.backgroundQueue = [];
    for(let asset of args) {
      if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(asset)) {
        this.backgroundQueue.push({
          type: 'image',
          src: asset,
        });
      } else if((/\.(mp4|webm)$/i).test(asset)) {
        this.backgroundQueue.push({
          type: 'video',
          src: asset
        });
      }

      this.totalNumberOfBackgroundAssets++;
    }
  }

  startPreload() {
    for(let asset of this.preloadQueue) {
      var t = this.preloadAsset(asset.src, asset.type);
      t.then(() => {
        this.preloadProgressHandler();
      })
      .catch(() => {
        this.errorHandler();
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
        this.errorHandler();
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

        asset.onload = resolve;
        asset.onerror = reject;
        asset.src = path + "?_=" + (new Date().getTime());
        if(type == 'video') {
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

  resetAllCallbacks() {
    this.preloadProgressCallback =  null;
    this.preloadCompletedCallback =  null;

    this.backgroundProgressCallback = null;
    this.backgroundCompletedCallback = null;
  }

  errorHandler() {
    console.log("An error occured");
  }
}

export default TBLoader;
