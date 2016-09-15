import Entity from './Entity';

export default class Platform extends Entity {
	constructor(x, y, width, height) {
		super();
		this.x = x;
		this.y = y;
		this.body = Matter.Bodies.rectangle(this.x, this.y, width, height, {
			isStatic: true
		});
/*
		this.bounds = new PIXI.Rectangle(this.x, this.y, width, height);
		this.boundsSprite = new PIXI.Graphics();
		this.boundsSprite.lineStyle(1, 0x00FF00, 1);
		this.boundsSprite.beginFill();
		this.boundsSprite.drawRect(0, 0, this.bounds.width, this.bounds.height);
		this.boundsSprite.endFill();
*/
		this.setTag('platform');
//		this.addChild(this.boundsSprite);
	}
}
