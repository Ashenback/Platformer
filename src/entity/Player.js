import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import { clamp } from 'util/math';
import Entity from './Entity';
import Animation from '../core/Animation';
import engine from 'core/Engine';
import { hitTestRectangle } from 'util/collision';

export default class Player extends Entity {
	constructor() {
		super();
		this.landAnimation = new Animation(
			PIXI.loader.resources.player_land.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				type: 'linear'
			}
		);

		this.runAnimation = new Animation(
			PIXI.loader.resources.player_run.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45),
				new PIXI.Rectangle(72, 0, 36, 45),
				new PIXI.Rectangle(108, 0, 36, 45),
				new PIXI.Rectangle(144, 0, 36, 45),
				new PIXI.Rectangle(180, 0, 36, 45),
				new PIXI.Rectangle(216, 0, 36, 45),
				new PIXI.Rectangle(252, 0, 36, 45),
				new PIXI.Rectangle(288, 0, 36, 45),
				new PIXI.Rectangle(324, 0, 36, 45)
			]
		);

		this.runAnimationFlipped = new Animation(
			PIXI.loader.resources.player_run_flipped.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45),
				new PIXI.Rectangle(72, 0, 36, 45),
				new PIXI.Rectangle(108, 0, 36, 45),
				new PIXI.Rectangle(144, 0, 36, 45),
				new PIXI.Rectangle(180, 0, 36, 45),
				new PIXI.Rectangle(216, 0, 36, 45),
				new PIXI.Rectangle(252, 0, 36, 45),
				new PIXI.Rectangle(288, 0, 36, 45),
				new PIXI.Rectangle(324, 0, 36, 45)
			]
		);

		this.jumpAnimation = new Animation(
			PIXI.loader.resources.player_jump.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45)
			],
			{
				type: 'linear'
			}
		);

		this.jumpAnimationFlipped = new Animation(
			PIXI.loader.resources.player_jump_flipped.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45)
			],
			{
				type: 'linear'
			}
		);

		this.airAnimation = new Animation(
			PIXI.loader.resources.player_air.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				type: 'linear'
			}
		);

		this.airAnimationFlipped = new Animation(
			PIXI.loader.resources.player_air_flipped.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				type: 'linear'
			}
		);

		this.idleAnimation = new Animation(
			PIXI.loader.resources.player_idle.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45),
				new PIXI.Rectangle(72, 0, 36, 45),
				new PIXI.Rectangle(108, 0, 36, 45),
				new PIXI.Rectangle(144, 0, 36, 45),
				new PIXI.Rectangle(180, 0, 36, 45)
			],
			{
				fps: 8.0
			}
		);

		this.idleAnimationFlipped = new Animation(
			PIXI.loader.resources.player_idle_flipped.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45),
				new PIXI.Rectangle(72, 0, 36, 45),
				new PIXI.Rectangle(108, 0, 36, 45),
				new PIXI.Rectangle(144, 0, 36, 45)
			],
			{
				fps: 8.0
			}
		);

		this.currentAnimation = this.idleAnimation;
		this.sprite = new PIXI.Sprite(this.currentAnimation.texture);

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
		this.vx = 0.0;
		this.vy = 0.0;
		this.dir = -1;
		this.maxVX = 6.0;
		this.hp = 0;
		this.maxHp = 100;
		this.inAir = false;
		this.isJumping = false;
		this.jumpTime = 0.0;
		this.airTime = 0.0;
		this.x = 50;
		this.y = -100;
		this.bounds = new PIXI.Rectangle(this.x, this.y, 26, 40);
		this.sprite.position.x = -5;
		this.sprite.position.y = -5;
		this.left = keyboard(keyCode.left);
		this.right = keyboard(keyCode.right);
		keyboard(keyCode.space).press = () => this.jump();
		keyboard(keyCode.enter).press = () => this.hurt(10);

		// debug stuff
		this.hitGraphics = new PIXI.Graphics();
		this.addChild(this.hitGraphics);
		this.hitLeft = new PIXI.Rectangle(0, 0 , 20, 25);
		this.hitRight = new PIXI.Rectangle(0, 0, 20, 25);
		this.hitUp = new PIXI.Rectangle(0, 0, 15, 20);
		this.hitDown = new PIXI.Rectangle(0, 0 , 15, 20);
		this.hitBoxes = [
			this.hitLeft,
			this.hitRight,
			this.hitUp,
			this.hitDown
		];
		// end of debug stuff

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
		if (!this.isJumping && !this.inAir) {
			this.vy -= this.jumpPower;
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
		if (this.left.isDown) {
			if (this.vx > 0) {
				this.vx = -this.acceleration * delta.deltaScale;
			} else {
				this.vx -= this.acceleration * delta.deltaScale;
			}
			this.dir = -1;
		}
		if (this.right.isDown) {
			if (this.vx < 0) {
				this.vx = this.acceleration * delta.deltaScale;
			} else {
				this.vx += this.acceleration * delta.deltaScale;
			}
			this.dir = 1;
		}

		if (!this.left.isDown && !this.right.isDown) {
			this.vx *= .4;
			if (Math.abs(this.vx) < 0.1) {
				this.vx = 0.0;
			}
		}

		this.vx = clamp(this.vx, -this.maxVX, this.maxVX);
		this.vy += this.gravity * delta.deltaScale;

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
		this.hitRight.x = vector.x + this.bounds.width - this.hitLeft.width;
		this.hitRight.y = vector.y + (this.bounds.height - this.hitLeft.height) / 2;
		this.hitUp.x = vector.x + (this.bounds.width - this.hitUp.width) / 2;
		this.hitUp.y = vector.y;
		this.hitDown.x = vector.x + (this.bounds.width - this.hitDown.width) / 2;
		this.hitDown.y = vector.y + this.bounds.height - this.hitDown.height;
	}

	changeAnimation(animation) {
		if (this.currentAnimation !== animation) {
			this.currentAnimation.stop();
			this.currentAnimation = animation;
			this.currentAnimation.play();
			this.sprite.texture = this.currentAnimation.texture;
		}
	}

	fixedUpdate(delta) {
		this.hitGraphics.clear();
		this.renderHitBoxes();

		// update animation
		if (this.isJumping) {
			if (this.vy < 0) {
				if (this.dir < 0) {
					this.changeAnimation(this.airAnimation);
				} else {
					this.changeAnimation(this.airAnimationFlipped);
				}
			} else {
				if (this.dir < 0) {
					this.changeAnimation(this.jumpAnimation);
				} else {
					this.changeAnimation(this.jumpAnimationFlipped);
				}
			}
		} else if (this.vy > 0) {
			if (this.dir < 0) {
				this.changeAnimation(this.airAnimation);
			} else {
				this.changeAnimation(this.airAnimationFlipped);
			}
		} else {
			if (this.vx === 0) {
				if (this.dir < 0) {
					this.changeAnimation(this.idleAnimation);
				} else {
					this.changeAnimation(this.idleAnimationFlipped);
				}
			} else {
				if (this.dir < 0) {
					this.changeAnimation(this.runAnimation);
				} else {
					this.changeAnimation(this.runAnimationFlipped);
				}
			}
		}
		this.currentAnimation.update(delta);
	}

	renderHitBoxes() {
		if (engine.state.debug) {
			this.hitGraphics.lineStyle(2, 0x00ff00, 1);
			this.hitBoxes.forEach(hitBox => {
				this.hitGraphics.moveTo(hitBox.x - this.bounds.x, hitBox.y - this.bounds.y);
				this.hitGraphics.lineTo(hitBox.x + hitBox.width - this.bounds.x, hitBox.y - this.bounds.y);
				this.hitGraphics.lineTo(hitBox.x + hitBox.width - this.bounds.x, hitBox.y + hitBox.height - this.bounds.y);
				this.hitGraphics.lineTo(hitBox.x - this.bounds.x, hitBox.y + hitBox.height - this.bounds.y);
				this.hitGraphics.lineTo(hitBox.x - this.bounds.x, hitBox.y - this.bounds.y);
			});
		}
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
}
