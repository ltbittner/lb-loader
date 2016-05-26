import Loader from '../src/index';

var loader = new Loader({
	preload: [
		'sample.jpg'
	],
	backgroundLoad: [
		'sample.mp3'
	],
	autoStartBackgroundLoad: true
});

loader.startLoad();