import config from 'util/config';
import State from 'core/State';
import Player from 'entity/Player';
import Platform from 'entity/Platform';

export default class Play extends State {
	constructor(engine) {
		super('Play', engine);

		const player = new Player();
		this.addChild(player);

		const platform1 = new Platform(100, config.height - 80, 100, 20);
		this.addChild(platform1);

		const platform2 = new Platform(250, config.height - 160, 100, 20);
		this.addChild(platform2);

		const platform3 = new Platform(500, config.height - 240, 100, 20);
		this.addChild(platform3);

		const platform4 = new Platform(300, config.height - 50, 50, 50);
		this.addChild(platform4);
	}
}
