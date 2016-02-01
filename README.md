# Loader
A preloader and background loader rolled into one.

# Usage

Require or include the library
```javascript
import loader from 'path/to/loader'
```

Create an instance of the loader
```javascript
let loader = new Loader({options});
```

Options is an object with the following parameters:

**preload**: an array of strings with the path to the assets you wish to preload  
**background load**: same as above, but path to assets you want loaded in the background after preload       
**preloadProgressCallback**: function to call after each asset is preloaded       
**preloadCompletedCallback**: function to call when all assets are preloaded              
**backgroundProgressCallback**: function to call after each asset is background loaded       
**backgroundCompletedCallback**: function to call when background loading is complete      
**autoStartBackgroundLoad**: true or false | start background load as soon as preload is done? Default false

Start the load
```javascript
loader.startLoad();
```

# Example

```javascript
import Loader from 'path/to/loader';

let loader = new Loader({
    preload: ['assets/image1.jpg', 'assets/image2.jpg', 'assets/video1.mp4'],
    backgroundLoad: ['assets,image3.jpg', 'assets/video2.webm'],
    preloadProgressCallback: preloadProgress,
    preloadCompletedCallback: preloadDone,
    backgroundProgressCallback: backgroundProgress,
    backgroundCompletedCallback backgroundDone,
    autoStartBackgroundLoad: true
});

function preloadProgress(e) {
    //e contains three properties: completed, total, and percentage
    console.log("Done " + e.percentage + "% of preload");
}

function preloadDone() {
    console.log("Preload done");
}

function backgroundProgress(e) {
    console.log("Done " + e.percentage + "% of background load");
}

function backgroundDone() {
    console.log("Background load done");
}
```



