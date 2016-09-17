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
		this.label.y = -this.label.height - 5.0;
		this.label.x = -(this.label.width / 2);
		this.acceleration = 15.0;
		this.jumpPower = 10.0;
		this.gravity = 20.0;
		this.deacceleration = 20.0;
		this.airMovementModifier = 0.5;
		this.multiJumpThreshold = 0.2;
		this.vx = 0.0;
		this.vy = 0.0;
		this.maxVX = 6.0;
		this.hp = 0;
		this.maxHp = 100;
		this.inAir = false;
		this.isJumping = false;
		this.x = 200;
		this.y = 200;
		this.bounds = new PIXI.Rectangle(this.x, this.y, this.sprite.width, this.sprite.height);
		this.left = keyboard(keyCode.left);
		this.right = keyboard(keyCode.right);
		keyboard(keyCode.space).press = () => this.jump();
		keyboard(keyCode.enter).press = () => this.hurt(10);

		this.setTag('player');
		this.addChild(this.sprite);
		this.addChild(this.label);
		this.revive();

		// debug stuff
		this.hitGraphics = new PIXI.Graphics();
		this.addChild(this.hitGraphics);
		this.hitLeft = new PIXI.Rectangle(this.x, this.y + this.height / 2 - 10, 20, 20);
		this.hitRight = new PIXI.Rectangle(this.x + this.bounds.width - 20, this.y + this.height / 2 - 10, 20, 20);
		this.hitUp = new PIXI.Rectangle(this.x + this.bounds.width / 2 - 10, this.y, 20, 20);
		this.hitDown = new PIXI.Rectangle(this.x + this.bounds.width / 2 - 10, this.y + this.bounds.height - 20, 20, 20);
		this.hitBoxes = [
			this.hitLeft,
			this.hitRight,
			this.hitUp,
			this.hitDown
		]
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
		if (!this.isJumping && !this.inAir) {
			this.vy = -this.jumpPower;
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

	update(delta) {
		let nextX = this.x;
		let nextY = this.y;
		if (this.left.isDown) {
			if (this.vx > 0) {
				this.vx = -this.acceleration * delta.deltaScale;
			} else {
				this.vx -= this.acceleration * delta.deltaScale;
			}
		}
		if (this.right.isDown) {
			if (this.vx < 0) {
				this.vx = this.acceleration * delta.deltaScale;
			} else {
				this.vx += this.acceleration * delta.deltaScale;
			}
		}

		if (!this.left.isDown && !this.right.isDown) {
			this.vx *= .4;
		}

		this.vx = clamp(this.vx, -this.maxVX, this.maxVX);
		this.vy += this.gravity * delta.deltaScale;

		nextX += this.vx;
		nextY += this.vy;
/*
		this.hitLeft.visible = false;
		this.hitRight.visible = false;
		this.hitUp.visible = false;
		this.hitDown.visible = false;
*/
		this.checkCollisionAndMove();

		this.inAir = Math.abs(this.vy) > 0.01;

		this.bounds.x = this.x;
		this.bounds.y = this.y;

		this.label.text = `${this.x.toFixed(1)}, ${this.y.toFixed(1)}|${this.vx.toFixed(1)}, ${this.vy.toFixed(1)} : J ${this.isJumping ? 'Y' : 'N'} : A ${this.inAir ? 'Y' : 'N'}`;
		this.label.x = -(this.label.width / 2) + (this.sprite.width / 2);
	}

	updateHitBoxes(vector){
		this.hitLeft.x = vector.x;
		this.hitLeft.y = vector.y + (this.bounds.height - this.hitLeft.height) / 2;
		this.hitRight.x = vector.x + this.bounds.width - 20;
		this.hitRight.y = vector.y + (this.bounds.height - this.hitLeft.height) / 2;
		this.hitUp.x = vector.x + this.bounds.width / 2 - 10;
		this.hitUp.y = vector.y;
		this.hitDown.x = vector.x + this.bounds.width / 2 - 10;
		this.hitDown.y = vector.y + this.bounds.height - 20;
	}

	fixedUpdate() {
		this.hitGraphics.clear();
		this.hitGraphics.lineStyle(2, 0x00ff00, 1);
		this.hitBoxes.forEach(hitBox => {
			this.hitGraphics.moveTo(hitBox.x - this.bounds.x, hitBox.y - this.bounds.y);
			this.hitGraphics.lineTo(hitBox.x + hitBox.width - this.bounds.x, hitBox.y - this.bounds.y);
			this.hitGraphics.lineTo(hitBox.x + hitBox.width - this.bounds.x, hitBox.y + hitBox.height - this.bounds.y);
			this.hitGraphics.lineTo(hitBox.x - this.bounds.x, hitBox.y + hitBox.height - this.bounds.y);
			this.hitGraphics.lineTo(hitBox.x - this.bounds.x, hitBox.y - this.bounds.y);
		});
	}

	checkCollisionAndMove() {
		const step = 0.1;
		let nextX = this.x + this.vx;
		let nextY = this.y + this.vy;
		this.updateHitBoxes({x: nextX, y: nextY});
		//const hitRect = new PIXI.Rectangle(this.x, this.y, nextX + this.bounds.width, nextY + this.bounds.height);
		const hitRect = new PIXI.Rectangle(nextX, nextY, this.bounds.width, this.bounds.height);
		engine.state.children.forEach(child => {
			if (child && child.hasTag && child.hasTag('platform')) {
				if (hitTestRectangle(hitRect, child.bounds)) {
					const hitLeft = hitTestRectangle(this.hitLeft, child.bounds);
					const hitRight = hitTestRectangle(this.hitRight, child.bounds);
					const hitUp = hitTestRectangle(this.hitUp, child.bounds);
					const hitDown = hitTestRectangle(this.hitDown, child.bounds);

					if (hitLeft && hitRight && hitDown) {
						this.vy = 0;
						this.isJumping = false;
						this.hitDown.y -= step;
						nextY -= step;
						while(hitTestRectangle(this.hitDown, child.bounds)) {
							this.hitDown.y -= step;
							nextY -= step;
						}
					} else if (hitLeft && hitRight && hitUp) {
						this.vy = 0;
						this.hitUp.y += step;
						nextY += step;
						while(hitTestRectangle(this.hitUp, child.bounds)) {
							this.hitUp.y += step;
							nextY += step;
						}
					} else if (hitUp && hitDown && hitLeft) {
						this.vx = 0;
						this.hitLeft.x += step;
						nextX += step;
						while(hitTestRectangle(this.hitLeft, child.bounds)) {
							this.hitLeft.x += step;
							nextX += step;
						}
					} else if (hitUp && hitDown && hitRight) {
						this.vx = 0;
						this.hitRight.x -= step;
						nextX -= step;
						while(hitTestRectangle(this.hitRight, child.bounds)) {
							this.hitRight.x -= step;
							nextX -= step;
						}
					} else {
						if (hitTestRectangle(this.hitLeft, child.bounds)) {
							this.vx = 0;
							this.hitLeft.x += step;
							nextX += step;
							while(hitTestRectangle(this.hitLeft, child.bounds)) {
								this.hitLeft.x += step;
								nextX += step;
							}
						}
						if (hitTestRectangle(this.hitRight, child.bounds)) {
							this.vx = 0;
							this.hitRight.x -= step;
							nextX -= step;
							while(hitTestRectangle(this.hitRight, child.bounds)) {
								this.hitRight.x -= step;
								nextX -= step;
							}
						}
						if (hitTestRectangle(this.hitUp, child.bounds)) {
							this.vy = 0;
							this.hitUp.y += step;
							nextY += step;
							while(hitTestRectangle(this.hitUp, child.bounds)) {
								this.hitUp.y += step;
								nextY += step;
							}
						}
						if (hitTestRectangle(this.hitDown, child.bounds)) {
							this.vy = 0;
							this.isJumping = false;
							this.hitDown.y -= step;
							nextY -= step;
							while(hitTestRectangle(this.hitDown, child.bounds)) {
								this.hitDown.y -= step;
								nextY -= step;
							}
						}
					}
				}
			}
		});
		this.x = nextX;
		this.y = nextY;
	}

	checkCollisionAndMove_() {
		let nextX = this.x + this.vx;
		let nextY = this.y + this.vy;
		const hitRect = new PIXI.Rectangle(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		engine.state.children.forEach(child => {
			if (child && child.hasTag && child.hasTag('platform')) {
				hitRect.x = nextX;
				hitRect.y = nextY;
				if (hitTestRectangle(hitRect, child.bounds)) {
					hitRect.x = this.x;
					hitRect.y = this.y;
					const diffX = child.bounds.x - hitRect.x;
					if (child.bounds.x > hitRect.x + hitRect.width - diffX ||
						child.bounds.x + child.bounds.width < hitRect.x - diffX
					) {
						hitRect.x = nextX;
						if (hitTestRectangle(hitRect, child.bounds)) {
							const diff = (child.bounds.x + child.bounds.width / 2) - (hitRect.x + hitRect.width / 2);
							if (diff < 0) {
								hitRect.x = nextX = child.bounds.x + child.bounds.width;
								//this.hitLeft.visible = true;
							} else {
								hitRect.x = nextX = child.bounds.x - hitRect.width;
								//this.hitRight.visible = true;
							}
							this.vx = 0;
						}
					} else {
						hitRect.y = nextY;
						if (hitTestRectangle(hitRect, child.bounds)) {
							const diff = (child.bounds.y + child.bounds.height / 2) - (hitRect.y + hitRect.height / 2);
							if (diff < 0) {
								hitRect.y = nextY = child.bounds.y + child.bounds.height;
								//this.hitUp.visible = true;
							} else {
								hitRect.y = nextY = child.bounds.y - hitRect.height;
								//this.hitDown.visible = true;
								this.isJumping = false;
								this.inAir = false;
							}
							this.vy = 0;
						}
					}
				} else {
					hitRect.x = nextX;
					if (hitTestRectangle(hitRect, child.bounds)) {
						const diff = child.bounds.x - hitRect.x;
						if (diff < 0) {
							hitRect.x = nextX = child.bounds.x + child.bounds.width;
						} else {
							hitRect.x = nextX = child.bounds.x - hitRect.width;
						}
						this.vx = 0;
					}
					hitRect.y = nextY;
					if (hitTestRectangle(hitRect, child.bounds)) {
						const diff = child.bounds.y - hitRect.y;
						if (diff < 0) {
							hitRect.y = nextY = child.bounds.y + child.bounds.height;
						} else {
							hitRect.y = nextY = child.bounds.y - hitRect.height;
							this.isJumping = false;
							this.inAir = false;
						}
						this.vy = 0;
					}
				}
			}
		});
		this.x = nextX;
		this.y = nextY;
		this.updateHitBoxes({x: nextX, y: nextY});
	}
}
