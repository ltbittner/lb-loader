import Loader from '../src/index';

var loader = new Loader({
	preload: getAssets(),
	backgroundLoad: getAssets(),
	autoStartBackgroundLoad: true,
	preloadProgressCallback,
	backgroundLoadProgressCallback,
	backgroundLoadCompletedCallback,
	sequential: true,
	dev: true // option for testing only - avoids browser caching
});

document.getElementById('load').onclick = function() {
	loader.startPreload();
}

function preloadProgressCallback(e) {
	document.getElementById('pprogress').innerHTML = e.percentage;
};

function backgroundLoadProgressCallback(e) {
	document.getElementById('bprogress').innerHTML = e.percentage;
};

function backgroundLoadCompletedCallback() {
	document.getElementById('status').innerHTML = 'All assets loaded.';
};

function getAssets() {
	// In this example, same files are being loaded multiple times by setting option {dev: true}.
	// Without the dev option, redundant files will be simply skipped.
	return [
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg',
		'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg'
	];
}
