export default class Collidable {
	parent;
	bounds;
	tags = [];

	constructor(parent, bounds, tags) {
		this.parent = parent;
		this.bounds = bounds;
		this.tags = tags;
	}

	hasTag(tag) {
		return this.tags.includes(tag);
	}

	setTag(tag) {
		if (!this.tags.includes(tag)) {
			this.tags.push(tag);
		}
	}
}
