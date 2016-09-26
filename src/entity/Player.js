import keyboard, * as keyCode from 'util/keyboard';
import config from 'util/config';
import Entity from './Entity';
import Animation from '../core/Animation';
import engine from 'core/Engine';
import Bounds from 'core/Bounds';
import { hitTestBounds } from 'util/collision';

export default class Player extends Entity {
	constructor() {
		super();
		this.landAnimation = new Animation(
			PIXI.loader.resources.player_land.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				name: 'Player Landing',
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
			],
			{
				name: 'Player Run'
			}
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
			],
			{
				name: 'Player Run Flipped'
			}
		);

		this.jumpAnimation = new Animation(
			PIXI.loader.resources.player_jump.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45),
				new PIXI.Rectangle(36, 0, 36, 45)
			],
			{
				name: 'Player Jump',
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
				name: 'Player Jump Flipped',
				type: 'linear'
			}
		);

		this.airAnimation = new Animation(
			PIXI.loader.resources.player_air.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				name: 'Player Air',
				type: 'linear'
			}
		);

		this.airAnimationFlipped = new Animation(
			PIXI.loader.resources.player_air_flipped.texture,
			[
				new PIXI.Rectangle(0, 0, 36, 45)
			],
			{
				name: 'Player Air Flipped',
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
				name: 'Player Idle',
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
				name: 'Player Idle Flipped',
				fps: 8.0
			}
		);

		this.currentAnimation = this.idleAnimation;
		this.sprite = new PIXI.Sprite(this.currentAnimation.texture);
		this.label = new PIXI.Text(
			'Silver Fox',
			{
				fontSize: `12px`,
				fontFamily: config.fontFamily,
				fill: 'white',
				stroke: 0xffc0c0,
				strokeThickness: 1,
				letterSpacing: 1
			}
		);
/*
		this.label = new PIXI.extras.BitmapText(
			'Silver',
			{
				font: {
					name: config.fontFamily,
					size: 14
				},
			}
		);
*/
		this.label.y = -this.label.height - 10.0;
		this.label.x = -(this.label.width / 2);
		this.acceleration = 15.0;
		this.jumpPower = 5.0;
		this.gravity = 20.0;
		this.vx = 0.0;
		this.vy = 0.0;
		this.dir = -1;
		this.maxVX = 6.0;
		this.maxVY = 10.0;
		this.hp = 0;
		this.maxHp = 100;
		this.inAir = false;
		this.isJumping = false;
		this.isGrounded = false;
		this.jumpTime = 0.0;
		this.airTime = 0.0;
		this.bounds = new Bounds(0, 0, 16, 32);
		engine.state.collidables.push(this);
		this.sprite.position.x = (this.bounds.width - this.sprite.width) / 2;
		this.sprite.position.y = this.bounds.height - this.sprite.height;
		this.left = keyboard(keyCode.left);
		this.right = keyboard(keyCode.right);
		this.shift = keyboard(keyCode.shift);
		this.shift.press = () => this.maxVX = 19.0;
		this.shift.release = () => this.maxVX = 6.0;
		this.space = keyboard(keyCode.space);
		//keyboard(keyCode.space).press = () => this.jump();
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
			this.isGrounded = false;
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

		if (this.space.isDown && (!this.inAir || (this.isJumping && this.airTime < 98))) {
			this.jumpTime += delta.deltaTime;
			console.log('jumpTime', this.jumpTime);
			this.vy -= this.jumpPower;
			if (this.vy < -this.maxVY) {
				this.vy = -this.maxVY;
			}
			this.isJumping = true;
			this.isGrounded = false;
			this.inAir = true;
		}

		if (!this.left.isDown && !this.right.isDown) {
			this.vx *= .4;
			if (Math.abs(this.vx) < 0.1) {
				this.vx = 0.0;
			}
		}

		if (Math.abs(this.vx) > this.maxVX) {
			this.vx = this.maxVX * Math.sign(this.vx);
			this.vx *= .9;
		}
		this.vy += this.gravity * delta.deltaScale;
/*
		if (Math.abs(this.vy) > this.maxVY) {
			this.vy = this.maxVY * Math.sign(this.vy);
			this.vy *= .9;
		}
*/
		this.checkCollisionAndMove();

		this.inAir = Math.abs(this.vy) > 0.01;

		if (this.inAir) {
			this.airTime += delta.deltaTime;
		}

		// update run animation speed depending on horizontal velocity
		this.runAnimation.fps = (Math.abs(this.vx) / this.maxVX) * (this.maxVX * 2.8);
		this.runAnimationFlipped.fps = (Math.abs(this.vx) / this.maxVX) * (this.maxVX * 2.8);

		this.x = this.bounds.x;
		this.y = this.bounds.y;

		// this.label.text = `${this.x.toFixed(1)}, ${this.y.toFixed(1)}|${this.vx.toFixed(1)}, ${this.vy.toFixed(1)} : J ${this.isJumping ? 'Y' : 'N'} : A ${this.inAir ? 'Y' : 'N'}`;
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
			console.log('change animation', animation.name);
			this.currentAnimation.stop();
			this.currentAnimation = animation;
			this.currentAnimation.play();
			this.sprite.texture = this.currentAnimation.texture;
		}
	}

	fixedUpdate(delta) {
		//this.renderHitBoxes();

		// update animation
		if (this.isJumping) {
			if (this.vy < 0) {
				if (this.dir < 0) {
					this.changeAnimation(this.jumpAnimation);
				} else {
					this.changeAnimation(this.jumpAnimationFlipped);
				}
			} else {
				if (this.dir < 0) {
					this.changeAnimation(this.airAnimation);
				} else {
					this.changeAnimation(this.airAnimationFlipped);
				}
			}
		} else if (this.inAir) {
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
		this.hitGraphics.clear();
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
		let nextX = this.bounds.x + this.vx;
		let nextY = this.bounds.y + this.vy;
		const stepX = Math.sign(this.vx);
		const stepY = Math.sign(this.vy);
		const diffX = Math.abs(nextX - this.bounds.x);
		const diffY = Math.abs(nextY - this.bounds.y);
		const entities = [];
		const left = Math.min(this.bounds.x, nextX);
		const top = Math.min(this.bounds.y, nextY);
		const right = Math.max(this.bounds.right, nextX + this.bounds.width);
		const bottom = Math.max(this.bounds.bottom, nextY + this.bounds.height);
		const hitRect = new Bounds(
			left,
			top,
			right - left,
			bottom - top
		);
		engine.state.children.forEach(entity => {
			if (entity.hasTag && entity.hasTag('platform')) {
				if (hitTestBounds(hitRect, entity.bounds)) {
					entities.push(entity);
				}
			}
		});
		let computations = 0;
		for (let x = 0; x < diffX; x++) {
			this.bounds.x += stepX;
			let hit = false;
			let slope = false;
			for (let i = 0; i < entities.length; i++) {
				const entity = entities[i];
				if (entity.hasTag && entity.hasTag('platform')) {
					if (hitTestBounds(this.bounds, entity.bounds)) {
						// do pixel collision here
						const l = Math.max(this.bounds.left, entity.bounds.left) - entity.bounds.left;
						const r = Math.min(this.bounds.right, entity.bounds.right) - entity.bounds.left;
						const t = Math.max(this.bounds.top, entity.bounds.top) - entity.bounds.top;
						const b = Math.min(this.bounds.bottom, entity.bounds.bottom) - entity.bounds.top;
						const pixels = entity.imageData;
						for (let py = t; py < b; py++) {
							const yy = py * entity.sprite.width * 4;
							for (let px = l; px < r; px++) {
								const xx = px * 4;
								const a = pixels[xx + yy + 3];
								computations++;
								if (a > 0) {
									hit = entity;
									if (r - l > 4) {
										slope = true;
									}
									break;
								}
							}
						}
					}
				}
			}
			if (hit) {
				// revert colliding step
				//this.bounds.y -= 2;
				if (!slope) {
					this.bounds.x -= stepX;
					this.vx = -this.vx * hit.restitution;
					if (Math.abs(this.vx) < 0.004) {
						this.vx = 0;
					}
				}
				break;
			}
		}
		for (let y = 0; y < diffY; y++) {
			this.bounds.y += stepY;
			let hit = false;
			for (let i = 0; i < entities.length; i++) {
				const entity = entities[i];
				if (entity.hasTag && entity.hasTag('platform')) {
					if (hitTestBounds(this.bounds, entity.bounds)) {
						// do pixel collision here
						const l = Math.max(this.bounds.left, entity.bounds.left) - entity.bounds.left;
						const r = Math.min(this.bounds.right, entity.bounds.right) - entity.bounds.left;
						const t = Math.max(this.bounds.top, entity.bounds.top) - entity.bounds.top;
						const b = Math.min(this.bounds.bottom, entity.bounds.bottom) - entity.bounds.top;
						const pixels = entity.imageData;
						for (let py = t; py < b; py++) {
							const yy = py * entity.sprite.width * 4;
							for (let px = l; px < r; px++) {
								const xx = px * 4;
								const a = pixels[xx + yy + 3];
								computations++;
								if (a > 0) {
									hit = entity;
									break;
								}
							}
						}
					}
				}
			}
			if (hit) {
				// revert colliding step
				this.bounds.y -= stepY;
				if (this.vy > 0) {
					this.isJumping = false;
					this.isGrounded = true;
					this.jumpTime = 0;
					this.airTime = 0;
				}
				this.vy = -this.vy * hit.restitution;
				if (Math.abs(this.vy) < 0.004) {
					this.vy = 0;
				}
				break;
			}
		}
		//console.log('computations', computations);
	}

/*
	checkCollisionAndMove() {
		let nextX = this.x + this.vx;
		let nextY = this.y + this.vy;
		const hitRect = new SAT.Box(new SAT.Vector(nextX, nextY), this.bounds.width, this.bounds.height).toPolygon();
		const response = new SAT.Response();
		engine.state.children.forEach(entity => {
			if (entity.hasTag && (entity.hasTag('platform') || entity.hasTag('polygon'))) {
				response.clear();
				let entityRect;
				if (entity.hasTag('platform')) {
					entityRect = new SAT.Box(
						new SAT.Vector(entity.bounds.x, entity.bounds.y),
						entity.bounds.width,
						entity.bounds.height
					).toPolygon();
				} else {
					entityRect = entity.bounds;
				}
				if (SAT.testPolygonPolygon(hitRect, entityRect, response)) {
					nextX -= response.overlapV.x;
					nextY -= response.overlapV.y;
					if (Math.abs(response.overlapV.x) > 0 && Math.abs(response.overlapV.y) > 0) {
						this.vx *= 0.9;
						this.vy *= 0.9;
						this.isJumping = false;
						this.isGrounded = false;
					} else {
						if (Math.abs(response.overlapV.x) > 0) {
							this.vx = 0;
						}
						if (Math.abs(response.overlapV.y) > 0) {
							this.vy = 0;
							this.isJumping = false;
						}
					}
				}
			}
		});
		this.x = nextX;
		this.y = nextY;
	}
*/
/*
	checkCollisionAndMove() {
		let nextX = this.x + this.vx;
		let nextY = this.y + this.vy;
		const hitRect = new Bounds(nextX, nextY, this.bounds.width, this.bounds.height);
		const pMidX = hitRect.midX;
		const pMidY = hitRect.midY;
		engine.state.children.forEach(entity => {
			if (entity.hasTag && entity.hasTag('platform')) {
				if (hitTestBounds(hitRect, entity.bounds)) {
					const cMidX = entity.bounds.midX;
					const cMidY = entity.bounds.midY;
					const dx = (cMidX - pMidX) / (entity.bounds.halfWidth);
					const dy = (cMidY - pMidY) / (entity.bounds.halfHeight);

					const absDX = Math.abs(dx);
					const absDY = Math.abs(dy);

					if (Math.abs(absDX - absDY) < 0.2) {
						// Corner collision
						if (dx < 0) {
							nextX = entity.bounds.right;
						} else {
							nextX = entity.bounds.left - this.bounds.width;
						}

						if (dy < 0) {
							nextY = entity.bounds.bottom;
						} else {
							nextY = entity.bounds.top - this.bounds.height;
						}
						this.isJumping = false;

						if (Math.random() < .5) {
							this.vx = -this.vx * entity.restitution;
							if (Math.abs(this.vx) < 0.004) {
								this.vx = 0;
							}
						} else {
							this.vy = -this.vy * entity.restitution;
							if (Math.abs(this.vy) < 0.004) {
								this.vy = 0;
							}
						}
					} else if (absDX > absDY) {
						// horizontal collision
						if (dx < 0) {
							nextX = entity.bounds.right;
						} else {
							nextX = entity.bounds.left - this.bounds.width;
						}
						this.vx = -this.vx * entity.restitution;
						if (Math.abs(this.vx) < 0.004) {
							this.vx = 0;
						}
					} else {
						// vertical collision
						if (dy < 0) {
							nextY = entity.bounds.bottom;
						} else {
							nextY = entity.bounds.top - this.bounds.height;
						}
						this.isJumping = false;
						this.vy = -this.vy * entity.restitution;
						if (Math.abs(this.vy) < 0.004) {
							this.vy = 0;
						}
					}
				}
			}
		});
		this.x = nextX;
		this.y = nextY;
	}
*/
/*
	checkCollisionAndMove() {
		const step = 0.1;
		let nextX = this.x + this.vx;
		let nextY = this.y + this.vy;
		this.updateHitBoxes({x: nextX, y: nextY});
		//const hitRect = new PIXI.Rectangle(this.x, this.y, nextX + this.bounds.width, nextY + this.bounds.height);
		const hitRect = new PIXI.Rectangle(nextX, nextY, this.bounds.width, this.bounds.height);
		engine.state.collidables.forEach(collidable => {
			if (collidable.hasTag('platform')) {
				if (hitTestBounds(hitRect, collidable.bounds)) {
					const hitLeft = hitTestRectangle(this.hitLeft, collidable.bounds);
					const hitRight = hitTestRectangle(this.hitRight, collidable.bounds);
					const hitUp = hitTestRectangle(this.hitUp, collidable.bounds);
					const hitDown = hitTestRectangle(this.hitDown, collidable.bounds);

					if (hitLeft && hitRight && hitDown) {
						this.vy = 0;
						this.isJumping = false;
						this.hitDown.y -= step;
						nextY -= step;
						while(hitTestRectangle(this.hitDown, collidable.bounds)) {
							this.hitDown.y -= step;
							nextY -= step;
						}
					} else if (hitLeft && hitRight && hitUp) {
						this.vy = 0;
						this.hitUp.y += step;
						nextY += step;
						while(hitTestRectangle(this.hitUp, collidable.bounds)) {
							this.hitUp.y += step;
							nextY += step;
						}
					} else if (hitUp && hitDown && hitLeft) {
						this.vx = 0;
						this.hitLeft.x += step;
						nextX += step;
						while(hitTestRectangle(this.hitLeft, collidable.bounds)) {
							this.hitLeft.x += step;
							nextX += step;
						}
					} else if (hitUp && hitDown && hitRight) {
						this.vx = 0;
						this.hitRight.x -= step;
						nextX -= step;
						while(hitTestRectangle(this.hitRight, collidable.bounds)) {
							this.hitRight.x -= step;
							nextX -= step;
						}
					} else {
						if (hitTestRectangle(this.hitLeft, collidable.bounds)) {
							this.vx = 0;
							this.hitLeft.x += step;
							nextX += step;
							while(hitTestRectangle(this.hitLeft, collidable.bounds)) {
								this.hitLeft.x += step;
								nextX += step;
							}
						}
						if (hitTestRectangle(this.hitRight, collidable.bounds)) {
							this.vx = 0;
							this.hitRight.x -= step;
							nextX -= step;
							while(hitTestRectangle(this.hitRight, collidable.bounds)) {
								this.hitRight.x -= step;
								nextX -= step;
							}
						}
						if (hitTestRectangle(this.hitUp, collidable.bounds)) {
							this.vy = 0;
							this.hitUp.y += step;
							nextY += step;
							while(hitTestRectangle(this.hitUp, collidable.bounds)) {
								this.hitUp.y += step;
								nextY += step;
							}
						}
						if (hitTestRectangle(this.hitDown, collidable.bounds)) {
							this.vy = 0;
							this.isJumping = false;
							this.hitDown.y -= step;
							nextY -= step;
							while(hitTestRectangle(this.hitDown, collidable.bounds)) {
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
*/
}
