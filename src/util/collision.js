export function hitTestRectangle(r1, r2) {
	//Find the center points of each sprite
	r1.centerX = r1.x + r1.width / 2;
	r1.centerY = r1.y + r1.height / 2;
	r2.centerX = r2.x + r2.width / 2;
	r2.centerY = r2.y + r2.height / 2;

	//Find the half-widths and half-heights of each sprite
	r1.halfWidth = r1.width / 2;
	r1.halfHeight = r1.height / 2;
	r2.halfWidth = r2.width / 2;
	r2.halfHeight = r2.height / 2;

	//Calculate the distance vector between the sprites
	const vx = r1.centerX - r2.centerX;
	const vy = r1.centerY - r2.centerY;

	//Figure out the combined half-widths and half-heights
	const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	// Check collision
	return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
}
