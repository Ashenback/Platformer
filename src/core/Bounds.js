export default class Bounds {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + this.height;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.width;
	}

	get halfWidth() {
		return this.width / 2;
	}

	get halfHeight() {
		return this.height / 2;
	}

	get midX() {
		return this.left + this.width / 2;
	}

	get midY() {
		return this.top + this.height / 2;
	}

	clone() {
		return new Bounds(this.x, this.y, this.width, this.height);
	}
}
