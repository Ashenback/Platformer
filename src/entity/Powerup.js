import Collidable from 'core/Collidable';
import Entity from './Entity';
import engine from 'core/Engine';

export default class Powerup extends Entity {
	constructor() {
		super();
		this.bounds = new PIXI.Rectangle(this.x, this.y, width, height);
		this.collidable = new Collidable(this, this.bounds, ['platform']);
		engine.state.collidables.push(this.collidable);
	}
}
