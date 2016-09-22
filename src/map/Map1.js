import config from 'util/config';
import Collidable from 'core/Collidable';
import engine from 'core/Engine';
import Player from "entity/Player";
import Platform from "entity/Platform";

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

		console.log('tileSet', this.tileSet);

		this.mapData.layers.forEach(layer => {
			console.log('layer', layer.name, layer.type);
			if (layer.type === 'tilelayer') {
				if (layer.name === 'map') {
					layer.data.forEach((tileId, index) => {
						if (tileId > 0) {
							const zIndexId = tileId - 1;
							const texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(
								Math.floor(zIndexId % this.tileSet.columns) * this.tileSet.tilewidth,
								Math.floor(zIndexId / this.tileSet.columns) * this.tileSet.tileheight,
								this.tileSet.tilewidth,
								this.tileSet.tileheight,
							));
							const tileSprite = new PIXI.Sprite(texture);
							tileSprite.position.set(
								Math.floor(index % this.mapData.width) * this.tileSet.tilewidth,
								Math.floor(index / this.mapData.height) * this.tileSet.tileheight
							);
							this.addChild(tileSprite);
						}
					})
				}
			} else if (layer.type === 'objectgroup') {
				console.log('object group', layer.objects);
				if (layer.name === 'collision') {
					layer.objects.forEach(object => {
						const collidable = new Collidable(
							object,
							new PIXI.Rectangle(
								object.x,
								object.y,
								object.width,
								object.height
							),
							['platform', 'tile']
						);
						//console.log('add collision', object.name, collidable.bounds);
						engine.state.collidables.push(collidable);
					});
				} else if (layer.name === 'items') {

				} else if (layer.name === 'triggers') {
					layer.objects.forEach(object => {
						if (object.type === 'spawn') {
							if (object.name === 'player') {
								const player = new Player();
								player.position.set(object.x, object.y);
								engine.state.addChild(player);
								engine.state.setFocus(player);
								console.log('add player', player);
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
