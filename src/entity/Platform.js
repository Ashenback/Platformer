import Entity from './Entity';

export default class Platform extends Entity {
	constructor(x, y, width, height) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.bounds = new PIXI.Rectangle(this.x, this.y, width, height);
		this.setTag('platform');
		this.moving = false;
	}

	setMoving(vector, interval = 1000) {
		this.moving = true;
		this.vx = vector.x;
		this.vy = vector.y;
		setInterval(() => {
			this.vx *= -1.0;
			this.vy *= -1.0;
		}, interval);
	}

	update(delta) {
		if (this.moving) {
			this.x += this.vx * delta.deltaScale;
			this.y += this.vy * delta.deltaScale;
			this.bounds.x = this.x;
			this.bounds.y = this.y;
		}
	}
}
