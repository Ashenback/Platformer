function keyboard(keyCode) {
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = function (event) {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = function (event) {
		if (event.keyCode === key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	//Attach event listeners
	window.addEventListener(
		"keydown", key.downHandler.bind(key), false
	);
	window.addEventListener(
		"keyup", key.upHandler.bind(key), false
	);
	return key;
}

export default keyboard;

const esc = 27;
const tab = 9;
const enter = 13;
const space = 32;
const up = 38;
const down = 40;
const left = 37;
const right = 39;
const a = 65;
const b = 66;
const c = 67;
const d = 68;
const e = 69;
const f = 70;
const g = 71;
const h = 72;
const i = 73;
const j = 74;
const k = 75;
const l = 76;
const m = 77;
const n = 78;
const o = 79;
const p = 80;
const q = 81;
const r = 82;
const s = 83;
const t = 84;
const u = 85;
const v = 86;
const w = 87;
const x = 88;
const y = 89;
const z = 90;
const zero = 48;
const one = 49;
const two = 50;
const three = 51;
const four = 52;
const five = 53;
const six = 54;
const seven = 55;
const eight = 56;
const nine = 57;
const numZero = 96;
const numOne = 97;
const numTwo = 98;
const numThree = 99;
const numFour = 100;
const numFive = 101;
const numSix = 102;
const numSeven = 103;
const numEight = 104;
const numNine = 105;
const mul = 106;
const add = 107;
const sub = 109;
const dec = 110;
const div = 111;

export {
	esc, tab, enter, space, up, down, left, right,
	a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z,
	zero, one, two, three, four, five, six, seven, eight, nine,
	numZero, numOne, numTwo, numThree, numFour, numFive, numSix, numSeven, numEight, numNine,
	mul, add, sub, dec, div
};
