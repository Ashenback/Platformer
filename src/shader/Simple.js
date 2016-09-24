import fragSrc from 'assets/shader/Simple.frag';

function Simple() {
	PIXI.Filter.call(this,
		null,
		fragSrc
	);
}

Simple.prototype = Object.create(PIXI.Filter.prototype);
Simple.prototype.constructor = Simple;

export default Simple;
