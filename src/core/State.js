export default class State extends PIXI.Container {
	name;

	constructor(name, engine) {
		super();
		this.name = name;
		this.engine = engine;
	}

	getEntitiesByTag(tag) {
		return this.children.filter(entity => entity.hasTag && entity.hasTag(tag));
	}

	stateMount() {}
	shouldStateUpdate() { return true; }
	update(timestamp) { this.children.forEach(entity => entity.update && entity.update(timestamp)); }
	shouldStatePostRenderUpdate() { return true; }
	postRenderUpdate() {}
	stateUnmount() {}
}
