import config from 'util/config';

class Engine {
	state;

	constructor() {
		this.renderer = PIXI.autoDetectRenderer(config.width, config.height);
	}

	changeState(newState) {
		if (newState) {
			const oldState = this.state;
			newState.stateMount();
			this.state = newState;
			if (oldState) {
				oldState.stateUnmount();
			}
		}
	}

	update(delta) {
		if (this.state.shouldStateUpdate()) {
			this.state.update(delta);
		}
	}

	render() {
		this.renderer.render(this.state);
		if (this.state.shouldStatePostRenderUpdate()) {
			this.state.postRenderUpdate();
		}
	}
}

export default new Engine();
