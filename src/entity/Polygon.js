import Entity from './Entity';
import engine from 'core/Engine';

export default class Polygon extends Entity {
	constructor(x, y, polygon) {
		super();
		this.x = x;
		this.y = y;
		this.bounds = new SAT.Polygon(
			new SAT.Vector(this.x, this.y),
			polygon.map(vector => (
				new SAT.Vector(vector.x, vector.y)
			)));
		engine.state.collidables.push(this);
		this.setTag('polygon');
	}
}
