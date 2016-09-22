import fragSrc from 'assets/shader/BurningShip.frag';

function BurningShip(uniforms) {
	PIXI.Filter.call(this,
		null,
		fragSrc,
		uniforms
	);
}

BurningShip.prototype = Object.create(PIXI.Filter.prototype);
BurningShip.prototype.constructor = BurningShip;

export default BurningShip;
