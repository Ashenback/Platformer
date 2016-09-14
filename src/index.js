import keyboard, * as keyCode from 'util/keyboard';
import engine from 'core/Engine';
import Play from 'states/Play';
import Pause from 'states/Pause';

const node = document.createElement('div');
node.style.position = 'absolute';
node.style.top = '50%';
node.style.left = '50%';
node.style.transform = 'translate(-50%, -50%)';
node.appendChild(engine.renderer.view);
document.body.appendChild(node);

function loadProgressHandler(loader, resource) {
	console.log('loading: ', resource.name);
	console.log('progress: ', loader.progress + '%');
}

PIXI.loader
	.add('player_air', 'assets/player_air.png')
	.add('player_air_flipped', 'assets/player_air_flipped.png')
	.add('player_idle', 'assets/player_idle.png')
	.add('player_idle_flipped', 'assets/player_idle_flipped.png')
	.add('player_jump', 'assets/player_jump.png')
	.add('player_jump_flipped', 'assets/player_jump_flipped.png')
	.add('player_land', 'assets/player_land.png')
	.add('player_land_flipped', 'assets/player_land_flipped.png')
	.add('player_run', 'assets/player_run.png')
	.add('player_run_flipped', 'assets/player_run_flipped.png')
	.on('progress', loadProgressHandler)
	.load(setup);

function setup() {
	const play = new Play(engine);
	const pause = new Pause(engine);

	keyboard(keyCode.esc).release = function () {
		engine.changeState(engine.state === play ? pause : play);
	};

	engine.changeState(play);
	gameLoop(0);
}

let time = 0;
function gameLoop(timestamp) {
	requestAnimationFrame(gameLoop);
	const deltaTime = timestamp - time;
	const deltaScale = deltaTime / 1000.0;
	time = timestamp;
	engine.update({deltaTime, deltaScale});
	engine.render();
}
