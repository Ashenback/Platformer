function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clamp(num, min, max) {
	return Math.max(Math.min(num, max), min);
}

export {
	randomInt,
	clamp
};
