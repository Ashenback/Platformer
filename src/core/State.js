import config from 'util/config';

export default class State extends PIXI.Container {
	name;
	focus;

	constructor(name) {
		super();
		this.name = name;
		this.scale = new PIXI.Point(config.scale, config.scale);
	}

	getEntitiesByTag(tag) {
		return this.children.filter(entity => entity.hasTag && entity.hasTag(tag));
	}


	setFocus(entity) {
		this.focus = entity;
	}
	stateMount() {}
	shouldStateUpdate() { return true; }
	update(timestamp) { this.children.forEach(entity => entity.update && entity.update(timestamp)); }
	shouldStatePostRenderUpdate() { return true; }
	postRenderUpdate() {}
	stateUnmount() {}
}
