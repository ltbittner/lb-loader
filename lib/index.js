'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var LBLoader = function () {
  function LBLoader() {
    var _this = this;

    var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LBLoader);

    if (instance) {
      return instance;
    }
    instance = this;

    if (args.preload) {
      this.preloadQueue = [];
      this.preloadProgressCallback = args.preloadProgressCallback || null;
      this.preloadCompletedCallback = function () {
        if (args.preloadCompletedCallback) {
          args.preloadCompletedCallback();
        }
        if (args.autoStartBackgroundLoad === true) {
          _this.startBackgroundLoad();
        }
        if (!args.backgroundLoad) {
          _this.destroy();
        }
      };
      this.initializeQueue(args.preload, this.preloadQueue);
    }

    if (args.backgroundLoad) {
      this.backgroundLoadQueue = [];
      this.backgroundLoadProgressCallback = args.backgroundLoadProgressCallback || null;
      this.backgroundLoadCompletedCallback = function () {
        if (args.backgroundLoadCompletedCallback) {
          args.backgroundLoadCompletedCallback();
        }
        _this.destroy();
      };
      this.initializeQueue(args.backgroundLoad, this.backgroundLoadQueue);
    }
  }

  _createClass(LBLoader, [{
    key: 'startPreload',
    value: function startPreload() {
      if (!this.preloadQueue) {
        console.error(new Error('Assets to be preloaded are not defined.'));
        return;
      }
      this.loadAssets(this.preloadQueue, this.preloadProgressCallback, this.preloadCompletedCallback);
    }
  }, {
    key: 'startBackgroundLoad',
    value: function startBackgroundLoad() {
      if (!this.backgroundLoadQueue) {
        console.error(new Error('Assets to be loaded in the background are not defined.'));
        return;
      }
      this.loadAssets(this.backgroundLoadQueue, this.backgroundLoadProgressCallback, this.backgroundLoadCompletedCallback);
    }
  }, {
    key: 'initializeQueue',
    value: function initializeQueue(args, queue) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var src = _step.value;

          var type = void 0;
          if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(src)) {
            type = 'image';
          } else if (/\.(mp3|ogg|wav)$/i.test(src)) {
            type = 'audio';
          } else if (/\.(mp4|webm)$/i.test(src)) {
            type = 'video';
          }
          if (type) {
            queue.push({ type: type, src: src });
          } else {
            this.destroy();
            console.error(new Error('Unable to handle \'' + src + '\'. File format is not supported.'));
            return;
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
    key: 'loadAssets',
    value: function loadAssets(queue, progressCallback, completeCallback) {
      var _this2 = this;

      var count = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var asset = _step2.value;

          _this2.loadAsset(asset.src, asset.type).then(function () {
            count++;
            if (progressCallback) {
              _this2.progressHandler(queue, count, progressCallback);
            }
            if (count == queue.length) {
              completeCallback();
            }
          }).catch(function () {
            _this2.errorHandler(asset.src);
          });
        };

        for (var _iterator2 = queue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
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
    key: 'loadAsset',
    value: function loadAsset(src, type) {
      return new Promise(function (resolve, reject) {
        var asset = void 0;
        if (type == 'image') {
          asset = new Image();
        } else {
          asset = document.createElement(type);
          asset.addEventListener('suspend', resolve);
        }
        asset.onload = resolve;
        asset.onerror = reject;
        asset.src = src;
        if (type == 'video') {
          asset.load();
        }
      });
    }
  }, {
    key: 'progressHandler',
    value: function progressHandler(queue, count, progressCallback) {
      progressCallback({
        completed: count,
        total: queue.length,
        percentage: Math.round(count / queue.length * 100)
      });
    }
  }, {
    key: 'errorHandler',
    value: function errorHandler(src) {
      this.destroy();
      console.error(new Error('\'' + src + '\' is not found.'));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.preloadQueue = [];
      this.preloadProgressCallback = null;
      this.preloadCompletedCallback = null;
      this.backgroundLoadQueue = [];
      this.backgroundProgressCallback = null;
      this.backgroundCompletedCallback = null;
      instance = null;
    }
  }]);

  return LBLoader;
}();

module.exports = LBLoader;