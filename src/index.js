import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import engine from 'core/Engine';
import Play from 'states/Play';
import Pause from 'states/Pause';

const node = document.createElement('div');
node.id = 'root';
node.style.position = 'absolute';
node.style.top = '50%';
node.style.left = '50%';
node.style.transform = `translate(-50%, -50%)`;
node.style.zIndex = '-1';
node.appendChild(engine.renderer.view);
document.body.appendChild(node);
WebFont.load({
	custom: {
		families: [config.fontFamily]
	},
	active: () => run()
});
function loadProgressHandler(loader, resource) {
	console.log('loading: ', resource.name);
	console.log('progress: ', loader.progress + '%');
}
function run() {
	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	PIXI.loader
		.add(config.fontFamily, config.assetsRoot + config.fontFile)
		.add('player_air', config.assetsRoot + 'player_air.png')
		.add('player_air_flipped', config.assetsRoot + 'player_air_flipped.png')
		.add('player_idle', config.assetsRoot + 'player_idle.png')
		.add('player_idle_flipped', config.assetsRoot + 'player_idle_flipped.png')
		.add('player_jump', config.assetsRoot + 'player_jump.png')
		.add('player_jump_flipped', config.assetsRoot + 'player_jump_flipped.png')
		.add('player_land', config.assetsRoot + 'player_land.png')
		.add('player_land_flipped', config.assetsRoot + 'player_land_flipped.png')
		.add('player_run', config.assetsRoot + 'player_run.png')
		.add('player_run_flipped', config.assetsRoot + 'player_run_flipped.png')
		.on('progress', loadProgressHandler)
		.load(setup);

	function setup(loader, resources) {
		Object.keys(resources).forEach(resourceKey => {
			const resource = resources[resourceKey];
			console.log('resource', resource);
			if (resource.isImage) {
				resource.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
				resource.texture.baseTexture.mipmap = false;
			}
		});
		const play = new Play(engine);
		const pause = new Pause(engine);

		keyboard(keyCode.esc).release = function () {
			engine.changeState(engine.state === play ? pause : play);
		};

		engine.changeState(play);
		gameLoop(0);
	}

	function timestamp() {
		if (window.performance && window.performance.now)
			return window.performance.now();
		else
			return new Date().getTime();
	}

	let time = 0;

	function gameLoop(timestamp) {
		requestAnimationFrame(gameLoop);
		const deltaTime = timestamp - time;
		const deltaScale = deltaTime / 1000.0;
		time = timestamp;
		engine.update({ deltaTime, deltaScale });
		engine.render();
	}
}
