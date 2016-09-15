import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import { clamp } from 'util/math';
import Entity from './Entity';
import engine from 'core/Engine';
import { hitTestRectangle } from 'util/collision';

export default class Player extends Entity {
	constructor() {
		super();
		this.sprite = new PIXI.Sprite(
			PIXI.loader.resources.player_land_flipped.texture
		);

		this.label = new PIXI.Text(
			'Player',
			{
				fontSize: `12px`,
				fontFamily: config.font,
				fill: 'white',
				stroke: 0xffc0c0,
				strokeThickness: 1
			}
		);
		this.label.y = -this.label.height;
		this.label.x = -(this.label.width / 2);
		this.acceleration = 0.005;
		this.deacceleration = 20.0;
		this.airMovementModifier = 0.5;
		this.multiJumpThreshold = 0.2;
		this.vx = 0.0;
		this.vy = 0.0;
		this.maxVX = 10.0;
		this.hp = 0;
		this.maxHp = 100;
		this.inAir = false;
		this.isJumping = false;
		this.x = 200;
		this.y = 200;
		this.body = Matter.Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, {
			inertia: Infinity,
			friction: 0,
			frictionAir: 0,
			mass: 10.0
		});
		this.left = keyboard(keyCode.left);
		this.right = keyboard(keyCode.right);
		keyboard(keyCode.space).press = () => this.jump();
		keyboard(keyCode.enter).press = () => this.hurt(10);

		this.setTag('player');
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

	jump() {
		if (!this.isJumping) {
			Matter.Body.applyForce(
				this.body,
				this.body.position,
				Matter.Vector.create(0, -0.1)
			);
			this.isJumping = true;
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
		if (this.left.isDown) {
			Matter.Body.applyForce(
				this.body,
				this.body.position,
				Matter.Vector.create(-this.acceleration, 0)
			);
		}
		if (this.right.isDown) {
			Matter.Body.applyForce(
				this.body,
				this.body.position,
				Matter.Vector.create(this.acceleration, 0)
			);
		}

		this.inAir = Math.abs(this.body.velocity.y) > 0.001;
		this.isJumping = Math.abs(this.body.velocity.y) > this.multiJumpThreshold;
	}

	fixedUpdate() {
		this.x = this.body.position.x - this.sprite.width / 2;
		this.y = this.body.position.y - this.sprite.height / 2;
		this.label.text = `${this.body.motion}, ${this.body.speed}`;
		//this.label.style.fill = this.hurtColor;
		//this.label.text = 'Player';
		this.label.x = -(this.label.width / 2) + (this.sprite.width / 2);
	}

	update_(delta) {
		if (this.left.isDown) {
			this.vx -= (this.acceleration * (this.inAir ? 0.5 : 1.0)) * delta.deltaScale;
		}
		if (this.right.isDown) {
			this.vx += (this.acceleration * (this.inAir ? 0.5 : 1.0)) * delta.deltaScale;
		}
		this.vx = clamp(this.vx, -this.maxVX, this.maxVX);

		if (!this.right.isDown && !this.left.isDown && !this.inAir) {
			this.vx *= 1.0 - (this.deacceleration * delta.deltaScale);
		}

		this.vy += 30.0 * delta.deltaScale;

		let newX = this.x + this.vx;
		let newY = this.y + this.vy;
		if (newY < 0) {
			newY = 0;
			this.vy = 0;
		}
		if (newY > config.height - this.bounds.height) {
			newY = config.height - this.bounds.height;
			this.vy = 0;
			this.isJumping = false;
		}
		if (newX < 0) {
			newX = 0;
			this.vx = 0;
		}
		if (newX > config.width - this.bounds.width) {
			newX = config.width - this.bounds.width;
			this.vx = 0;
		}

		if (Math.abs(this.vx) <= 0.1) {
			this.vx = 0.0;
		}

		this.inAir = this.vy != 0;

		const newBounds = new PIXI.Rectangle(newX, newY, this.bounds.width, this.bounds.height);
		const hit = engine.state.getEntitiesByTag('platform').find(sibling =>
			hitTestRectangle(newBounds, sibling.bounds)
		);
		if (hit) {
			const w = this.sprite.width * .80;
			const wh = this.sprite.width * .10;
			const h = this.sprite.height * .80;
			const hh = this.sprite.height * 0.10;
			const upDetector = new PIXI.Rectangle(newX + wh, newY - 2, w, 4);
			const downDetector = new PIXI.Rectangle(newX + wh, newY + this.sprite.height + 2, w, 4);
			const leftDetector = new PIXI.Rectangle(newX - 2, newY + hh, 4, h);
			const rightDetector = new PIXI.Rectangle(newX + this.sprite.width + 2, newY + hh, 4, h);
			const hitUp = hitTestRectangle(upDetector, hit.bounds);
			const hitDown = hitTestRectangle(downDetector, hit.bounds);
			const hitLeft = hitTestRectangle(leftDetector, hit.bounds);
			const hitRight = hitTestRectangle(rightDetector, hit.bounds);
			if (hitUp || hitDown) {
				this.vy = 0;
				if (hitDown) {
					this.inAir = false;
					this.isJumping = false;
					if (hitRight || hitLeft && !(hitLeft && hitRight)) {
						newY = hit.bounds.y - this.bounds.height;
					} else {
						newY = this.y;
					}
				} else {
					if (hitRight || hitLeft && !(hitLeft && hitRight)) {
						newY = hit.bounds.y + hit.bounds.height;
					} else {
						newY = this.y;
					}
				}
			}
			if (hitLeft || hitRight) {
				this.vx = 0;
				newX = this.x;
			}
		}
		this.x = newX;
		this.y = newY;
		this.bounds.x = this.x;
		this.bounds.y = this.y;
		//this.label.text = `HP: ${this.hp}/${this.maxHp} A: ${this.inAir ? 'y' : 'n'} J: ${this.isJumping ? 'y' : 'n'}`;
		//this.label.style.fill = this.hurtColor;
		this.label.text = 'Player';
		this.label.x = -(this.label.width / 2) + (this.sprite.width / 2);
	}
}
