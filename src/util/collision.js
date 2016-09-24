export function hitTestBounds(b1, b2) {
	//Calculate the distance vector between the sprites
	const dx = b1.midX - b2.midX;
	const dy = b1.midY - b2.midY;

	//Figure out the combined half-widths and half-heights
	const combinedHalfWidths = b1.halfWidth + b2.halfWidth;
	const combinedHalfHeights = b1.halfHeight + b2.halfHeight;

	// Check collision
	return Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights;
}
