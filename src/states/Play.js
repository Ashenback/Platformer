import keyboard from "util/keyboard";
import * as keyCode from "util/keyboard";
import config from "util/config";
import State from "core/State";
import Map1 from 'map/Map1';

export default class Play extends State {
	collidables = [];

	constructor(engine) {
		super('Play', engine);
		this.debug = false;
	}

	renderPhysics() {
		this.physicsGraphics.clear();
		this.physicsGraphics.lineStyle(2, 0xff0000, .5);
		this.children.forEach(child => {
			if (child && child.bounds) {
				if (child.hasTag('polygon')) {
					this.physicsGraphics.moveTo(
						child.bounds.pos.x + child.bounds.points[0].x,
						child.bounds.pos.y + child.bounds.points[0].y
					);
					child.bounds.points.forEach((point, index) => {
						if (index > 0) {
							this.physicsGraphics.lineTo(
								child.bounds.pos.x + point.x,
								child.bounds.pos.y + point.y
							);
						}
					});
					this.physicsGraphics.lineTo(
						child.bounds.pos.x + child.bounds.points[0].x,
						child.bounds.pos.y + child.bounds.points[0].y
					);
				} else {
					this.physicsGraphics.moveTo(child.bounds.x, child.bounds.y);
					this.physicsGraphics.lineTo(child.bounds.x + child.bounds.width, child.bounds.y);
					this.physicsGraphics.lineTo(child.bounds.x + child.bounds.width, child.bounds.y + child.bounds.height);
					this.physicsGraphics.lineTo(child.bounds.x, child.bounds.y + child.bounds.height);
					this.physicsGraphics.lineTo(child.bounds.x, child.bounds.y);
				}
			}
		});
	}

	toggleDebug() {
		this.debug = !this.debug;
		this.physicsGraphics.visible = this.debug;
	}

	update(delta) {
		if (this.map1.loaded) {
			this.children.forEach(entity => entity.update && entity.update(delta));
			this.children.forEach(entity => entity.fixedUpdate && entity.fixedUpdate(delta));
			if (this.focus) {
				const diffX = (-(this.focus.x * config.scale) + config.width / 2) - this.x;
				const diffY = (-(this.focus.y * config.scale) + config.height / 2) - this.y;
				this.x += diffX * 0.4;
				this.y += diffY * 0.4;
			}
			if (this.debug) {
				this.renderPhysics();
			}
		}
	}

	stateMount() {
		if (this.isSetup) return;
		this.isSetup = true;

		this.map1 = new Map1();
		this.addChild(this.map1);
		this.map1.load();

		keyboard(keyCode.f1).press = () => this.toggleDebug();

		this.physicsGraphics = new PIXI.Graphics();
		this.addChild(this.physicsGraphics);
	}

	stateUnmount() {
	}
}
