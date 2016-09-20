import keyboard from "util/keyboard";
import * as keyCode from "util/keyboard";
import config from "util/config";
import State from "core/State";
import Player from "entity/Player";
import Platform from "entity/Platform";

export default class Play extends State {
	constructor(engine) {
		super('Play', engine);
		this.debug = false;
		this.physicsGraphics = new PIXI.Graphics();
		this.addChild(this.physicsGraphics);

		const player = new Player();
		this.addChild(player);
		this.setFocus(player);

		const platform1 = new Platform(100, -80, 100, 20);
		platform1.setMoving({x: 0.0, y: 10.0}, 2000);
		this.addChild(platform1);

		const platform2 = new Platform(250, -160, 100, 20);
		platform2.setMoving({x: 8.0, y: 0.0}, 4000);
		this.addChild(platform2);

		const platform3 = new Platform(500, -240, 100, 20);
		platform3.setMoving({x: 8.0, y: 8.0});
		this.addChild(platform3);

		const platform4 = new Platform(300, -55, 50, 10);
		platform4.setMoving({x: 10.0, y: 0.0}, 10000);
		this.addChild(platform4);

		const wallN = new Platform(0, -400, 2000, 5);
		this.addChild(wallN);

		const wallS = new Platform(0, 0, 2000, 5);
		this.addChild(wallS);

		const wallW = new Platform(0, -400, 5, 400);
		this.addChild(wallW);

		keyboard(keyCode.f1).press = () => this.toggleDebug();
	}

	renderPhysics() {
		this.physicsGraphics.clear();
		this.physicsGraphics.lineStyle(2, 0xff0000, .5);
		this.children.forEach(child => {
			if (child && child.bounds) {
				this.physicsGraphics.moveTo(child.bounds.x, child.bounds.y);
				this.physicsGraphics.lineTo(child.bounds.x + child.bounds.width, child.bounds.y);
				this.physicsGraphics.lineTo(child.bounds.x + child.bounds.width, child.bounds.y + child.bounds.height);
				this.physicsGraphics.lineTo(child.bounds.x, child.bounds.y + child.bounds.height);
				this.physicsGraphics.lineTo(child.bounds.x, child.bounds.y);
			}
		});
	}

	toggleDebug() {
		this.debug = !this.debug;
		this.physicsGraphics.visible = this.debug;
	}

	update(delta) {
		this.children.forEach(entity => entity.update && entity.update(delta));
		this.children.forEach(entity => entity.fixedUpdate && entity.fixedUpdate(delta));
		if (this.focus) {
			const diffX = (-this.focus.x + config.width / 2) - this.x;
			const diffY = (-this.focus.y + config.height / 2) - this.y;
			this.x += diffX * 0.3;
			this.y += diffY * 0.3;
		}
		if (this.debug) {
			this.renderPhysics();
		}
	}

	stateMount() {
	}

	stateUnmount() {
	}
}
