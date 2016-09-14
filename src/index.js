import keyboard, * as keyCode from 'util/keyboard';
import Player from 'entity/Player';
import config from 'util/config';

var renderer = PIXI.autoDetectRenderer(config.width, config.height);

const node = document.createElement('div');
node.style.position = 'absolute';
node.style.top = '50%';
node.style.left = '50%';
node.style.transform = 'translate(-50%, -50%)';
node.appendChild(renderer.view);
document.body.appendChild(node);

var stage = new PIXI.Container();

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

function loadProgressHandler(loader, resource) {
	console.log('loading: ', resource.name);
	console.log('progress: ', loader.progress + '%');
}

var entities = [];
var state;
var stateChangeText;

keyboard(keyCode.space).release = function () {
	changeState(state === playState ? pauseState : playState);
};

let alphaInterval;
function changeState(newState) {
	if (newState !== state) {
		stateChangeText.visible = true;
		stateChangeText.alpha = 1.0;
		stateChangeText.text = state === playState ? 'Paused' : 'Playing';
		stateChangeText.x = (config.width - stateChangeText.width) / 2;
		stateChangeText.y = (config.height - stateChangeText.height) / 2;
		clearInterval(alphaInterval);
		setTimeout(() => {
			alphaInterval = setInterval(() => {
				stateChangeText.alpha -= 0.1;
				if (stateChangeText.alpha <= 0.0) {
					stateChangeText.visible = false;
					clearInterval(alphaInterval);
				}
			}, 50);
		}, 500);
		state = newState;
	}
}

function setup() {
	console.log('All files loaded!');
	state = playState;
	load();
	gameLoop();
}

function load() {
	const player = new Player();
	entities.push(player);
	stage.addChild(player);

	stateChangeText = new PIXI.Text(
		'',
		{
			font: `18px ${config.font}`,
			fill: 0xffffff,
			stroke: 0xff7f00,
			strokeThickness: 2
		}
	);
	stateChangeText.visible = false;
	stateChangeText.y = (config.height - stateChangeText.height) / 2;
	stage.addChild(stateChangeText);
}

function render() {
	renderer.render(stage);
}

function update() {
	state();
}

function playState() {
	entities.forEach(entity => entity.update());
}

function pauseState() {
}

function gameLoop() {
	requestAnimationFrame(gameLoop);
	update();
	render();
}

