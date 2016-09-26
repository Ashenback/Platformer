import config from 'util/config';
import engine from 'core/Engine';
import Player from "entity/Player";
import Platform from "entity/Platform";
import Polygon from "entity/Polygon";

export default class Map1 extends PIXI.Container {
	loaded = false;

	load() {
		if (this.loaded) return;
		this.loader = new PIXI.loaders.Loader();
		this.loader.add('map1', 'assets/map1.json')
			.after((resource, next) => {
				console.log('map1 loader', resource);
				if (resource.isJson && resource.data) {
					resource.data.tilesets.forEach(tileset => {
						if (tileset.image) {
							this.loader.add(tileset.name || tileset.image, config.assetsRoot + tileset.image);
						}
					});
				}
				next();
			})
			.load(this.setup);
	}

	setup = (loader, resources) => {
		console.log('resources', resources);
		this.mapData = resources.map1.data;
		console.log('mapData', this.mapData);
		this.width = this.mapData.width;
		this.height = this.mapData.height;
		this.tileSet = this.mapData.tilesets[0];
		const baseTexture = resources[this.tileSet.name].texture;
		const canvas = document.createElement('canvas');
		canvas.width = this.tileSet.imagewidth;
		canvas.height = this.tileSet.imageheight;
		const context = canvas.getContext('2d');
		context.drawImage(
			baseTexture.baseTexture.source,
			0,
			0,
			this.tileSet.imagewidth,
			this.tileSet.imageheight
		);

		console.log('tileSet', this.tileSet);
		this.mapData.layers.forEach(layer => {
			console.log('layer', layer.name, layer.type);
			if (layer.type === 'tilelayer') {
				if (layer.name === 'map') {
					layer.data.forEach((tileId, index) => {
						if (tileId > 0) {
							const zIndexId = tileId - 1;
							const texture = new PIXI.Texture(
								baseTexture,
								new PIXI.Rectangle(
									Math.floor(zIndexId % this.tileSet.columns) * this.tileSet.tilewidth,
									Math.floor(zIndexId / this.tileSet.columns) * this.tileSet.tileheight,
									this.tileSet.tilewidth,
									this.tileSet.tileheight
								)
							);
							const tileSprite = new PIXI.Sprite(texture);
							const entity = new Platform(
								Math.floor(index % this.mapData.width) * this.tileSet.tilewidth,
								Math.floor(index / this.mapData.height) * this.tileSet.tileheight,
								this.tileSet.tilewidth,
								this.tileSet.tileheight
							);
							entity.sprite = tileSprite;
							entity.addChild(tileSprite);
							entity.imageData = context.getImageData(
								texture.frame.x,
								texture.frame.y,
								texture.frame.width,
								texture.frame.height
							).data;
							engine.state.addChild(entity);
						}
					})
				}
			} else if (layer.type === 'objectgroup') {
				console.log('object group', layer.objects);
				if (layer.name === 'collision' && false) {
					layer.objects.forEach(object => {
						let entity;
						if (object.polygon) {
							entity = new Polygon(
								object.x,
								object.y,
								object.polygon
							)
						} else {
							entity = new Platform(
								object.x,
								object.y,
								object.width,
								object.height
							);
						}
						if (entity) {
							console.log('add collision entity', entity);
							engine.state.addChild(entity);
						}
					});
				} else if (layer.name === 'triggers') {
					layer.objects.forEach(object => {
						if (object.type === 'spawn') {
							if (object.name === 'player') {
								const player = new Player();
								player.bounds.x = object.x + (object.width - player.bounds.width) / 2;
								player.bounds.y = object.y + object.height - player.bounds.height;
								engine.state.addChild(player);
								engine.state.setFocus(player);
							}
						}
					});
				}
			} else if (layer.type === 'imagelayer') {
				if (layer.name === 'background') {
					this.bg = PIXI.Sprite.fromImage(config.assetsRoot + layer.image);
					this.addChild(this.bg);
				}
			}
		});

		this.loaded = true;
	}
}
