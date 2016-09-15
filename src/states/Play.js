import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import State from 'core/State';
import Player from 'entity/Player';
import Platform from 'entity/Platform';

export default class Play extends State {
	constructor(engine) {
		super('Play', engine);

		this.physics = Matter.Engine.create();
		this.world = this.physics.world;
		this.physicsGraphics = new PIXI.Graphics();
		this.debug = false;

		this.addChild(this.physicsGraphics);

		const player = new Player();
		this.addChild(player);
		Matter.World.add(this.world, player.body);

		const platform1 = new Platform(100, config.height - 80, 100, 20);
		this.addChild(platform1);
		Matter.World.add(this.world, platform1.body);

		const platform2 = new Platform(250, config.height - 160, 100, 20);
		this.addChild(platform2);
		Matter.World.add(this.world, platform2.body);

		const platform3 = new Platform(500, config.height - 240, 100, 20);
		this.addChild(platform3);
		Matter.World.add(this.world, platform3.body);

		const platform4 = new Platform(300, config.height - 50, 50, 50);
		this.addChild(platform4);
		Matter.World.add(this.world, platform4.body);

		const floor = new Platform(config.width / 2, config.height - 10, config.width, 5);
		this.addChild(floor);
		Matter.World.add(this.world, floor.body);

		keyboard(keyCode.f1).press = () => this.toggleDebug();
	}

	renderPhysics() {
		var bodies = Matter.Composite.allBodies(this.world);
		this.physicsGraphics.clear();
		this.physicsGraphics.lineStyle(1, 0xff0000, 1);
		for (var i = 0; i < bodies.length; i += 1) {
			var vertices = bodies[i].vertices;

			this.physicsGraphics.moveTo(vertices[0].x, vertices[0].y);

			for (var j = 1; j < vertices.length; j += 1) {
				this.physicsGraphics.lineTo(vertices[j].x, vertices[j].y);
			}

			this.physicsGraphics.lineTo(vertices[0].x, vertices[0].y);
		}
	}

	toggleDebug() {
		this.debug = !this.debug;
		this.physicsGraphics.visible = this.debug;
	}

	update() {
		this.children.forEach(entity => entity.update && entity.update());
		Matter.Engine.update(this.physics);
		this.children.forEach(entity => entity.fixedUpdate && entity.fixedUpdate());
		if (this.debug) {
			this.renderPhysics();
		}
	}

	stateMount() {
		//Matter.Render.run(this.renderer);
	}

	stateUnmount() {
		//Matter.Render.stop(this.renderer);
	}
}
