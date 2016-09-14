import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import Entity from './Entity';

export default class Player extends Entity {
	constructor() {
		super();
		this.sprite = new PIXI.Sprite(
			PIXI.loader.resources.player_land_flipped.texture
		);

		this.label = new PIXI.Text(
			'Player',
			{
				font: `12px ${config.font}`,
				fill: 'white',
				stroke: 0xffc0c0,
				strokeThickness: 1
			}
		);
		this.label.y = this.sprite.height;
		this.label.x = -(this.label.width / 2);
		this.speed = 1.0;
		this.vx = 0.0;
		this.vy = 0.0;
		this.hp = 0;
		this.maxHp = 100;

		this.x = 200;
		this.y = 200;

		this.left = keyboard(keyCode.left);
		this.right = keyboard(keyCode.right);
		this.up = keyboard(keyCode.up);
		this.down = keyboard(keyCode.down);
		keyboard(keyCode.enter).press = () => this.hurt(10);

		this.addChild(this.sprite);
		this.addChild(this.label);
		this.revive();
	}

	revive() {
		if (this.hp < this.maxHp) {
			this.reviveInterval = setInterval(() => {
				this.hp++;
				this.updateHurtColor();
				if (this.hp === this.maxHp) {
					clearInterval(this.reviveInterval);
					delete this.reviveInterval;
				}
			}, 50);
		}
	}

	hurt(dmg) {
		console.log('hurt', dmg, this.reviveInterval);
		if (!this.reviveInterval) {
			console.log('do hurt', dmg);
			this.hp -= dmg;
			this.updateHurtColor();
		}
	}

	updateHurtColor() {
		const hpDiff = this.hp / this.maxHp;
		const r = 0xff;
		const g = Math.max(0x0, 0xff * hpDiff);
		const b = Math.max(0x0, 0xff * (hpDiff / 2.0));
		this.hurtColor = ((r << 16) | (g << 8) | b);
	}

	update() {
		this.vx = this.vy = 0.0;
		if (this.left.isDown) {
			this.vx -= this.speed;
		}
		if (this.right.isDown) {
			this.vx += this.speed;
		}
		if (this.up.isDown) {
			this.vy -= this.speed;
		}
		if (this.down.isDown) {
			this.vy += this.speed;
		}
		this.x += this.vx;
		this.y += this.vy;
		this.label.text = `HP: ${this.hp}/${this.maxHp}`;
		this.label.style.fill = this.hurtColor;
		this.label.x = -(this.label.width / 2) + (this.sprite.width / 2);
	}
}
