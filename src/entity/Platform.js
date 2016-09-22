import Collidable from 'core/Collidable';
import Entity from './Entity';
import engine from 'core/Engine';

export default class Platform extends Entity {
	constructor(x, y, width, height) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.bounds = new PIXI.Rectangle(this.x, this.y, width, height);
		this.collidable = new Collidable(this, this.bounds, ['platform']);
		engine.state.collidables.push(this.collidable);
		this.setTag('platform');
		this.moving = false;
		this.gfx = new PIXI.Graphics();
		this.gfx.beginFill(0xff7f00);
		this.gfx.lineStyle(2, 0xff7f00, 1);
		this.gfx.drawRect(0, 0, width, height);
		this.gfx.endFill();
		this.addChild(this.gfx);
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
