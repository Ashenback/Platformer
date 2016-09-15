import Entity from './Entity';

export default class Platform extends Entity {
	constructor(x, y, width, height) {
		super();
		this.x = x;
		this.y = y;
		this.body = Matter.Bodies.rectangle(this.x, this.y, width, height, {
			isStatic: true,
			collisionFilter: {
				category: 0x0001
			}
		});
		this.setTag('platform');
	}
}
