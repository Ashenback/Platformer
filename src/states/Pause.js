import State from 'core/State';

export default class Pause extends State {
	constructor() {
		super('Pause');
	}

	shouldStateUpdate() {
		return false;
	}
}
