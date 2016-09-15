export default class Entity extends PIXI.Container {
	tags = [];

	hasTag(tag) {
		return this.tags.includes(tag);
	}

	setTag(tag) {
		if (!this.hasTag(tag)) {
			this.tags.push(tag);
		}
	}

	update() {}
	fixedUpdate() {}
}
