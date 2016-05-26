'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var LBLoader = function () {
  function LBLoader() {
    var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, LBLoader);

    // if(instance) {
    //   return instance;
    // }
    // instance = this;

    if (args.preload) {
      this.preloadQueue = [];
      this.preloadCount = 0;
      this.preloadProgressCallback = args.preloadProgressCallback || null;
      this.preloadCompletedCallback = args.preloadCompletedCallback || null;
      this.initializeQueue(args.preload, this.preloadQueue);
    }

    if (args.backgroundLoad) {
      this.backgroundLoadQueue = [];
      this.backgroundLoadCount = 0;
      this.backgroundProgressCallback = args.backgroundProgressCallback || null;
      this.backgroundCompletedCallback = args.backgroundCompletedCallback || null;
      this.autoStartBackgroundLoad = false || args.autoStartBackgroundLoad;
      this.initializeQueue(args.backgroundLoad, this.backgroundLoadQueue);
    }

    console.log(this.preloadQueue);
  }

  _createClass(LBLoader, [{
    key: 'startLoad',
    value: function startLoad() {
      if (this.preloadQueue) {
        this.startPreload();
      }
    }
  }, {
    key: 'initializeQueue',
    value: function initializeQueue(args, queue) {
      if (args == null || !args) {
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var asset = _step.value;

          if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(asset)) {
            queue.push({
              type: 'image',
              src: asset
            });
          } else if (/\.(mp4|webm)$/i.test(asset)) {
            queue.push({
              type: 'video',
              src: asset
            });
          } else if (/\.(mp3|ogg|wav)$/i.test(asset)) {
            queue.push({
              type: 'audio',
              src: asset
            });
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'initializeBackgroundQueue',
    value: function initializeBackgroundQueue(args) {
      if (args == null || !args) {
        return;
      }

      this.backgroundQueue = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var asset = _step2.value;

          if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(asset)) {
            this.backgroundQueue.push({
              type: 'image',
              src: asset
            });
          } else if (/\.(mp4|webm)$/i.test(asset)) {
            this.backgroundQueue.push({
              type: 'video',
              src: asset
            });
          } else if (/\.(mp3|ogg|wav)$/i.test(asset)) {
            this.backgroundQueue.push({
              type: 'audio',
              src: asset
            });
          }

          this.totalNumberOfBackgroundAssets++;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'startPreload',
    value: function startPreload() {
      var _this = this;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var asset = _step3.value;
          t = _this.preloadAsset(asset.src, asset.type);

          t.then(function () {
            _this.preloadProgressHandler();
          }).catch(function () {
            _this.errorHandler(asset.src);
          });
        };

        for (var _iterator3 = this.preloadQueue[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var t;

          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'startBackgroundLoad',
    value: function startBackgroundLoad() {
      var _this2 = this;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        var _loop2 = function _loop2() {
          var asset = _step4.value;
          t = _this2.preloadAsset(asset.src, asset.type);

          t.then(function () {
            _this2.backgroundProgressHandler();
          }).catch(function (e) {
            console.log(e);
            _this2.errorHandler(asset.src);
          });
        };

        for (var _iterator4 = this.backgroundQueue[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var t;

          _loop2();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: 'preloadAsset',
    value: function preloadAsset(path, type) {
      return new Promise(function (resolve, reject) {
        var asset = void 0;
        if (type == 'image') {
          asset = new Image();
        } else if (type == 'video') {
          asset = document.createElement('video');
          asset.addEventListener('suspend', resolve);
        } else if (type == 'audio') {
          asset = document.createElement('audio');
          asset.addEventListener('suspend', resolve);
        }

        asset.onload = resolve;
        asset.onerror = reject;
        asset.src = path + "?_=" + new Date().getTime();
        if (type == 'video' || type == 'audio') {
          asset.load();
        }
      });
    }
  }, {
    key: 'preloadProgressHandler',
    value: function preloadProgressHandler() {
      this.numberOfPreloadedAssets++;

      if (this.preloadProgressCallback) {
        var data = {
          completed: this.numberOfPreloadedAssets,
          total: this.totalNumberOfPreloadAssets,
          percentage: Math.round(this.numberOfPreloadedAssets / this.totalNumberOfPreloadAssets * 100)
        };

        this.preloadProgressCallback(data);
      }

      if (this.numberOfPreloadedAssets == this.totalNumberOfPreloadAssets) {
        this.preloadCompletedHandler();
      }
    }
  }, {
    key: 'backgroundProgressHandler',
    value: function backgroundProgressHandler(progress) {
      this.numberOfBackgroundAssets++;

      if (this.backgroundProgressCallback) {
        var data = {
          completed: this.numberOfBackgroundAssets,
          total: this.totalNumberOfBackgroundAssets,
          percentage: Math.round(this.numberOfBackgroundAssets / this.totalNumberOfBackgroundAssets * 100)
        };
        this.backgroundProgressCallback(data);
      }

      if (this.numberOfBackgroundAssets == this.totalNumberOfBackgroundAssets) {
        this.backgroundCompletedHandler();
      }
    }
  }, {
    key: 'preloadCompletedHandler',
    value: function preloadCompletedHandler() {
      if (this.preloadCompletedCallback) {
        this.preloadCompletedCallback();
      }
      if (this.autoStartBackgroundLoad) {
        this.startBackgroundLoad();
      }
    }
  }, {
    key: 'backgroundCompletedHandler',
    value: function backgroundCompletedHandler() {
      if (this.backgroundCompletedCallback) {
        this.backgroundCompletedCallback();
      }
      this.resetAllCallbacks();
    }
  }, {
    key: 'errorHandler',
    value: function errorHandler(asset) {
      this.resetAllCallbacks();
      this.preloadQueue = null;
      this.backgroundQueue = null;
      throw "Cannot find file " + asset;
    }
  }, {
    key: 'resetAllCallbacks',
    value: function resetAllCallbacks() {
      this.preloadProgressCallback = null;
      this.preloadCompletedCallback = null;

      this.backgroundProgressCallback = null;
      this.backgroundCompletedCallback = null;
    }
  }]);

  return LBLoader;
}();

module.exports = LBLoader;