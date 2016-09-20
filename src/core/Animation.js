import { clamp } from 'util/math';

export default class Animation {
	elapsed = 0;
	currentFrame = 0;
	frames = [];
	fps = 16.0;
	texture;
	type = 'loop';
	dir = 1;
	paused = false;

	constructor(texture, frames, options = {}) {
		this.texture = texture;
		this.frames = frames;
		this.texture.frame = this.frames[0];
		this.type = options.type || 'loop';
		this.fps = options.fps || 16.0;
	}

	pause() {
		this.paused = true;
	}

	play() {
		this.paused = false;
	}

	stop() {
		this.paused = true;
		this.currentFrame = 0;
	}

	updateLoop() {
		this.currentFrame = (this.currentFrame + 1) % this.frames.length;
	}

	updateLinear() {
		this.currentFrame = clamp(this.currentFrame++, 0, this.frames.length - 1);
	}

	updatePingPong() {
		this.currentFrame += this.dir;
		if (this.currentFrame > this.frames.length) {
			this.dir = -1;
			this.currentFrame--;
		} else if (this.currentFrame < 0) {
			this.dir = 1;
			this.currentFrame++;
		}
	}

	updateType() {
		switch(this.type) {
			case 'pingpong':
				this.updatePingPong();
				break;
			case 'linear':
				this.updateLinear();
				break;
			case 'loop':
			default:
				this.updateLoop();
		}
	}

	update(delta) {
		if (!this.frames.length) return;

		this.elapsed += delta.deltaTime;

		while(this.elapsed > 1000.0 / this.fps) {
			this.elapsed -= 1000.0 / this.fps;
			this.updateType();
		}

		this.texture.frame = this.frames[this.currentFrame];
	}
}
