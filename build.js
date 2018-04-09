/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProgram; });
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	console.error('Shader ERROR: ', gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vShader, fShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);

	gl.linkProgram(program);
	gl.validateProgram(program);

	if (gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		return program;
	}

	console.error('ERROR validating program: ', gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Arrow; });
class Arrow {
	constructor(props) {
		this.id = Arrow.count;
		Arrow.count += 1;
		this.posX = props.startPos.x;
		this.posY = props.startPos.y;
		this.size = 8;
		this.cursorPosX = props.cursorPos.x;
		this.cursorPosY = props.cursorPos.y;
		this.movingTimer = setInterval(() => this.step(), 16);
		this.stepNumber = 0;
		this.stepMax = 50;
		this.maxDistance = 500;
		this.vertexData = this.dataForVertexShader();

		const ac = this.cursorPosX - this.posX;
		const cb = this.cursorPosY - this.posY;
		const ab = Math.sqrt(ac * ac + cb * cb);
		const cosA = ac / ab;
		const al = cosA * this.maxDistance;
		let ld = Math.sqrt(this.maxDistance * this.maxDistance - al * al);

		if (this.cursorPosY < this.posY) ld *= -1;

		this.stepLengthX = al / this.stepMax;
		this.stepLengthY = ld / this.stepMax;
		this.translation = { x: 0, y: 0 };

		Arrow.all.push(this);
	}

	step() {
		if (this.stepNumber > this.stepMax) {
			clearInterval(this.movingTimer);
			return;
		}

		this.stepNumber += 1;
		this.posX += this.stepLengthX;
		this.posY += this.stepLengthY;
	}

	dataForVertexShader() {
		const data = [this.posX, this.posY, this.posX, this.posY + this.size, this.posX + this.size, this.posY + this.size, this.posX + this.size, this.posY + this.size, this.posX + this.size, this.posY, this.posX, this.posY];

		return data;
	}
}

Arrow.all = [];
Arrow.count = 0;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_webgl__ = __webpack_require__(3);


Object(__WEBPACK_IMPORTED_MODULE_0__src_webgl__["a" /* checkWebGL */])();
Object(__WEBPACK_IMPORTED_MODULE_0__src_webgl__["b" /* drawScene */])();

function setStatus(value) {
	const el = document.getElementById('status');
	el.innerHTML = value;
}

const ws = new WebSocket('ws://localhost:4000');

__WEBPACK_IMPORTED_MODULE_0__src_webgl__["c" /* player */].setSocket(ws);

ws.onopen = () => setStatus('ONLINE');
ws.onclose = () => setStatus('DISCONNECTED');
ws.onmessage = response => {
	console.log(response);
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return checkWebGL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return drawScene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return player; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__static_object__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__arrow__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shader_programs_static__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shader_programs_player__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shader_programs_units__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shader_programs_arrows__ = __webpack_require__(11);
const canvas = document.getElementById('canvas'); // Глобальная переменная
const gl = canvas.getContext('webgl'); // Глобальная переменная
canvas.width = gl.canvas.clientWidth;
canvas.height = gl.canvas.clientHeight;











const collisionCnt = [];

const player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* Player */]({ posX: canvas.width / 2, posY: canvas.height / 2, canvas: canvas, collisions: collisionCnt });
const obj1 = new __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */]({ posX: 350, posY: 550, width: 400, height: 40 });
const obj2 = new __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */]({ posX: 210, posY: 150, width: 20, height: 320 });
const obj3 = new __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */]({ posX: 510, posY: 210, width: 20, height: 260 });
const obj4 = new __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */]({ posX: 210, posY: 120, width: 320, height: 20 });
const obj5 = new __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */]({ posX: 210, posY: 480, width: 320, height: 20 });

const unit1 = new __WEBPACK_IMPORTED_MODULE_2__unit__["a" /* Unit */]({ posX: 300, posY: 50 });
const unit2 = new __WEBPACK_IMPORTED_MODULE_2__unit__["a" /* Unit */]({ posX: 700, posY: 360 });

collisionCnt.push(obj1.collisionShape());
collisionCnt.push(obj2.collisionShape());
collisionCnt.push(obj3.collisionShape());
collisionCnt.push(obj4.collisionShape());
collisionCnt.push(obj5.collisionShape());

collisionCnt.push(unit1.collisionShape());
collisionCnt.push(unit2.collisionShape());

const programForPlayer = Object(__WEBPACK_IMPORTED_MODULE_5__shader_programs_player__["a" /* createProgramForPlayer */])(gl, __WEBPACK_IMPORTED_MODULE_0__player__["a" /* Player */].vertexArray);
const programForStatic = Object(__WEBPACK_IMPORTED_MODULE_4__shader_programs_static__["a" /* createProgramForStatic */])(gl, __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */].vertexArray);
const programForUnits = Object(__WEBPACK_IMPORTED_MODULE_6__shader_programs_units__["a" /* createProgramForUnits */])(gl, __WEBPACK_IMPORTED_MODULE_2__unit__["a" /* Unit */].vertexArray);
const programForArrows = Object(__WEBPACK_IMPORTED_MODULE_7__shader_programs_arrows__["a" /* createProgramForArrows */])(gl);

function drawScene() {
	gl.clearColor(0.0, 0.0, 0.0, .1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(programForPlayer.program);
	programForPlayer.draw(player.figures);

	gl.useProgram(programForStatic.program);
	programForStatic.draw(player.translation, __WEBPACK_IMPORTED_MODULE_1__static_object__["a" /* StaticObject */].vertexArray.length / 2);

	gl.useProgram(programForUnits.program);
	programForUnits.draw(player.translation, __WEBPACK_IMPORTED_MODULE_2__unit__["a" /* Unit */].vertexArray.length / 2);

	gl.useProgram(programForArrows.program);
	programForArrows.draw(player.translation, __WEBPACK_IMPORTED_MODULE_3__arrow__["a" /* Arrow */]);

	requestAnimationFrame(drawScene);
}

function checkWebGL() {
	if (!gl) {
		alert('Ваш браузер не поддерживает WebGL');
		return;
	}

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	console.log('Resolution: ', gl.canvas.width, gl.canvas.height);
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Player; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__arrow__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw_lib_core__ = __webpack_require__(5);



class Player {
	constructor(props) {
		this.collisions = props.collisions;
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = 20;
		this.height = 20;
		this.state = 'standing';
		this.stepLength = 4;
		this.translation = { x: 0, y: 0 };
		this.moveDirection = { up: false, down: false, left: false, right: false };
		this.cursorX = 0;
		this.cursorY = 0;
		this.rotationX = 0;
		this.rotationY = -1;
		this.aimDistance = 20;
		this.aimSize = 8;
		this.figures = [];

		this.moveCicle = 10;
		this.moveIter = 5;
		this.legDirection = 1;

		Player.vertexArray = this.dataForVertexShader();

		addEventListener('keypress', e => this.changeMoveDirection(e, true));
		addEventListener('keyup', e => this.changeMoveDirection(e, false));
		props.canvas.addEventListener('mousemove', e => this.changeDirection(e));
		canvas.addEventListener('click', e => this.shot(e));
	}

	changeMoveDirection(e, ind) {
		switch (e.key) {
			case 'w':
				this.moveDirection.up = ind;
				break;
			case 's':
				this.moveDirection.down = ind;
				break;
			case 'a':
				this.moveDirection.left = ind;
				break;
			case 'd':
				this.moveDirection.right = ind;
				break;
		};

		if (ind) this.changeState('moving');

		if (!this.moveDirection.up && !this.moveDirection.down && !this.moveDirection.left && !this.moveDirection.right) {
			this.changeState('standing');
			this.figures[1].translationY = 0;
			this.figures[2].translationY = 0;
			this.figures[3].translationY = 0;
			this.figures[4].translationY = 0;
			this.moveIter = 5;
		}
	}

	setSocket(ws) {
		this.ws = ws;
	}

	step() {
		this.moveIter += this.legDirection;

		if (this.moveIter == this.moveCicle || this.moveIter == 0) {
			this.legDirection *= -1;
		}

		this.figures[1].translationY -= this.legDirection * 0.6;
		this.figures[2].translationY += this.legDirection * 0.6;
		this.figures[3].translationY += this.legDirection * 0.4;
		this.figures[4].translationY -= this.legDirection * 0.4;

		if (this.moveDirection.up) {
			this.translation.y += this.stepLength;
			if (this.checkCollisions()) {
				this.translation.y -= this.stepLength;
				return;
			}
		}

		if (this.moveDirection.down) {
			this.translation.y -= this.stepLength;
			if (this.checkCollisions()) {
				this.translation.y += this.stepLength;
				return;
			}
		}

		if (this.moveDirection.left) {
			this.translation.x += this.stepLength;
			if (this.checkCollisions()) {
				this.translation.x -= this.stepLength;
				return;
			}
		}

		if (this.moveDirection.right) {
			this.translation.x -= this.stepLength;
			if (this.checkCollisions()) {
				this.translation.x += this.stepLength;
				return;
			}
		}

		const str = 'X: ' + this.translation.x + ' Y: ' + this.translation.y;

		this.ws.send(str);
	}

	shot(e) {
		new __WEBPACK_IMPORTED_MODULE_0__arrow__["a" /* Arrow */]({
			startPos: {
				x: this.posX - this.translation.x,
				y: this.posY - this.translation.y
			},
			cursorPos: {
				x: e.offsetX - this.translation.x,
				y: e.offsetY - this.translation.y
			}
		});
	}

	changeState(value) {
		if (this.state == value) return;

		this.state = value;

		if (this.state == 'moving') {
			this.moveTimer = setInterval(() => this.step(), 20);
		}

		if (this.state == 'standing') clearInterval(this.moveTimer);
	}

	changeDirection(e) {
		this.cursorX = e.offsetX - this.posX;
		this.cursorY = e.offsetY - this.posY;

		const r = Math.sqrt(this.cursorX * this.cursorX + this.cursorY * this.cursorY);

		this.rotationX = -this.cursorX / r;
		this.rotationY = this.cursorY / r;

		for (let i = 0; i < this.figures.length; i++) {
			this.figures[i].rotationX = this.rotationX;
			this.figures[i].rotationY = this.rotationY;
		}
	}

	dataForVertexShader() {
		let data = {};

		const body = Object(__WEBPACK_IMPORTED_MODULE_1__draw_lib_core__["a" /* vertexesForCircle */])(this.posX, this.posY, 20, 20);
		// [
		// 							this.posX, this.posY,
		// 							this.posX + this.width, this.posY,
		// 							this.posX + this.width, this.posY + this.height,
		// 							this.posX + this.width, this.posY + this.height,
		// 							this.posX, this.posY + this.height,
		// 							this.posX, this.posY
		// 							]

		this.figures.push({
			bufferName: 'body',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: body.length
		});

		const leftLeg = Object(__WEBPACK_IMPORTED_MODULE_1__draw_lib_core__["a" /* vertexesForCircle */])(this.posX - 10, this.posY + 14, 6, 10);

		this.figures.push({
			bufferName: 'leftLeg',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: leftLeg.length
		});

		const rightLeg = Object(__WEBPACK_IMPORTED_MODULE_1__draw_lib_core__["a" /* vertexesForCircle */])(this.posX + 10, this.posY + 14, 6, 10);

		this.figures.push({
			bufferName: 'rightLeg',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: rightLeg.length
		});

		const leftHand = Object(__WEBPACK_IMPORTED_MODULE_1__draw_lib_core__["a" /* vertexesForCircle */])(this.posX - 22, this.posY + 0, 4, 4);

		this.figures.push({
			bufferName: 'leftHand',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: leftHand.length
		});

		const rightHand = Object(__WEBPACK_IMPORTED_MODULE_1__draw_lib_core__["a" /* vertexesForCircle */])(this.posX + 22, this.posY + 0, 4, 4);

		this.figures.push({
			bufferName: 'rightHand',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: rightHand.length
		});

		data = {
			body: body,
			leftLeg: leftLeg,
			rightLeg: rightLeg,
			leftHand: leftHand,
			rightHand: rightHand
		};

		return data;
	}

	collisionShape() {
		return { x: this.posX - this.width - this.translation.x, y: this.posY - this.height - this.translation.y, w: this.width * 2, h: this.height * 2 };
	}

	checkCollisions() {
		const rect = this.collisionShape();

		for (let i = 0; i < this.collisions.length; i++) {

			if (rect.x < this.collisions[i].x && rect.y < this.collisions[i].y) {
				const includeX = rect.x + rect.w >= this.collisions[i].x && rect.x + rect.w <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y + rect.h >= this.collisions[i].y && rect.y + rect.h <= this.collisions[i].y + this.collisions[i].h;

				if (includeX && includeY) return true;
			}

			if (rect.x < this.collisions[i].x && rect.y > this.collisions[i].y) {
				const includeX = rect.x + rect.w >= this.collisions[i].x && rect.x + rect.w <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y >= this.collisions[i].y && rect.y <= this.collisions[i].y + this.collisions[i].h;

				if (includeX && includeY) return true;
			}

			if (rect.x > this.collisions[i].x && rect.y < this.collisions[i].y) {
				const includeX = rect.x >= this.collisions[i].x && rect.x <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y + rect.h >= this.collisions[i].y && rect.y + rect.h <= this.collisions[i].y + this.collisions[i].h;

				if (includeX && includeY) return true;
			}

			if (rect.x > this.collisions[i].x && rect.y > this.collisions[i].y) {
				const includeX = rect.x >= this.collisions[i].x && rect.x <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y >= this.collisions[i].y && rect.y <= this.collisions[i].y + this.collisions[i].h;

				if (includeX && includeY) return true;
			}
		}

		return false;
	}

}

Player.vertexArray = [];



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vertexesForCircle; });
function vertexesForCircle(x, y, rX, rY) {
	let arr = [];

	for (let i = 0; i <= 360; i++) {
		let j = i * Math.PI / 180;
		arr = arr.concat([rX * Math.sin(j) + x, rY * Math.cos(j) + y]);
		arr = arr.concat([x, y]);
	}

	return arr;
}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StaticObject; });
class StaticObject {
	constructor(props) {
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = props.width;
		this.height = props.height;

		const arr = this.dataForVertexShader();
		StaticObject.vertexArray = StaticObject.vertexArray.concat(arr);
		StaticObject.vertexCount += arr.length / 2;
	}

	dataForVertexShader() {
		const data = [this.posX, this.posY, this.posX + this.width, this.posY, this.posX + this.width, this.posY + this.height, this.posX + this.width, this.posY + this.height, this.posX, this.posY + this.height, this.posX, this.posY];

		return data;
	}

	collisionShape() {
		return { x: this.posX, y: this.posY, w: this.width, h: this.height };
	}

}

StaticObject.vertexCount = 0;
StaticObject.vertexArray = [];



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Unit; });
class Unit {
	constructor(props) {
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = 20;
		this.height = 20;
		this.state = 'standing';

		const arr = this.dataForVertexShader();
		Unit.vertexArray = Unit.vertexArray.concat(arr);
		Unit.vertexCount += arr.length / 2;
	}

	dataForVertexShader() {
		const data = [this.posX, this.posY, this.posX + this.width, this.posY, this.posX + this.width / 2, this.posY - this.width];

		return data;
	}

	collisionShape() {
		return { x: this.posX, y: this.posY, w: this.width, h: this.height };
	}

}

Unit.vertexCount = 0;
Unit.vertexArray = [];



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProgramForStatic; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init__ = __webpack_require__(0);


function createProgramForStatic(gl, vertexArray) {
	const vertexShaderText = document.getElementById('static-vertex-shader').text;
	const fragmentShaderText = document.getElementById('static-fragment-shader').text;

	const vertexShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = Object(__WEBPACK_IMPORTED_MODULE_0__init__["a" /* createProgram */])(gl, vertexShader, fragmentShader);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const positionAttribLocation = gl.getAttribLocation(program, 'a_vertexPosition');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');

	const positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	function draw(translation, vertexCount) {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);

		gl.uniform2f(translationUniformLocation, translation.x, translation.y);
		gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
	}

	return { program: program, draw: draw };
}



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProgramForPlayer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init__ = __webpack_require__(0);


function createProgramForPlayer(gl, vertexArray) {
	const vertexShaderText = document.getElementById('player-vertex-shader').text;
	const fragmentShaderText = document.getElementById('player-fragment-shader').text;

	const vertexShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = Object(__WEBPACK_IMPORTED_MODULE_0__init__["a" /* createProgram */])(gl, vertexShader, fragmentShader);

	const positionAttribLocation = gl.getAttribLocation(program, 'vertex_Position');
	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
	const playerScaleUniformLocation = gl.getUniformLocation(program, 'u_playerScale');

	const positionBuffer = {
		body: gl.createBuffer(),
		leftHand: gl.createBuffer(),
		rightHand: gl.createBuffer(),
		leftLeg: gl.createBuffer(),
		rightLeg: gl.createBuffer()
	};

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.body);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.body), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.leftHand);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.leftHand), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.rightHand);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.rightHand), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.leftLeg);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.leftLeg), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.rightLeg);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.rightLeg), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	let playerScaleIter = 1;
	let playerScaleDirection = 1;

	function draw(figures) {
		for (let i = 0; i < figures.length; i++) {
			drawFigure(figures[i]);
		}
	}

	function drawFigure(figure) {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[figure.bufferName]);

		gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);

		if (playerScaleIter >= 240 || playerScaleIter <= 0) {
			playerScaleDirection = playerScaleDirection * -1;
		}
		playerScaleIter += 1 * playerScaleDirection;

		gl.uniform2f(translationUniformLocation, figure.translationX, figure.translationY);
		// gl.uniform2f(rotationUniformLocation, 0, 1);
		gl.uniform2f(rotationUniformLocation, figure.rotationX, figure.rotationY);
		gl.uniform2f(playerScaleUniformLocation, 1, 1);
		// gl.uniform2f(playerScaleUniformLocation, 0.7 + 0.002 * playerScaleIter, 0.7 + 0.002 * playerScaleIter);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, figure.vertexCount / 2);
	}

	return { program: program, draw: draw };
}



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProgramForUnits; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init__ = __webpack_require__(0);


function createProgramForUnits(gl, vertexArray) {
	const vertexShaderText = document.getElementById('units-vertex-shader').text;
	const fragmentShaderText = document.getElementById('units-fragment-shader').text;

	const vertexShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = Object(__WEBPACK_IMPORTED_MODULE_0__init__["a" /* createProgram */])(gl, vertexShader, fragmentShader);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const positionAttribLocation = gl.getAttribLocation(program, 'a_vertexPosition');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');

	const positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	function draw(translation, vertexCount) {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);

		gl.uniform2f(translationUniformLocation, translation.x, translation.y);
		gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
	}

	return { program: program, draw: draw };
}



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProgramForArrows; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init__ = __webpack_require__(0);


function createProgramForArrows(gl, vertexArray) {
	const vertexShaderText = document.getElementById('arrows-vertex-shader').text;
	const fragmentShaderText = document.getElementById('arrows-fragment-shader').text;

	const vertexShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = Object(__WEBPACK_IMPORTED_MODULE_0__init__["b" /* createShader */])(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = Object(__WEBPACK_IMPORTED_MODULE_0__init__["a" /* createProgram */])(gl, vertexShader, fragmentShader);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const positionAttribLocation = gl.getAttribLocation(program, 'a_vertexPosition');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
	const arrowTranslationUniformLocation = gl.getUniformLocation(program, 'u_arrowTranslation');
	let arrowCount = 0;

	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	function draw(playerTranslation, Arrow) {
		if (Arrow.all.length != arrowCount) {
			for (let i = arrowCount; i < Arrow.all.length; i++) {
				addArrowToBuffer(Arrow.all[i]);
			}
			arrowCount = Arrow.all.length;
		}

		for (let i = 0; i < Arrow.all.length; i++) {
			if (Arrow.all[i].stepNumber < Arrow.all[i].stepMax) {
				drawArrow(playerTranslation, Arrow.all[i]);
			} else {
				Arrow.all.splice(i, 1);
			}
		}
	}

	function drawArrow(translation, arrow) {
		gl.bindBuffer(gl.ARRAY_BUFFER, arrow.bufferLink);

		gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);

		arrow.translation.x += arrow.stepLengthX;
		arrow.translation.y += arrow.stepLengthY;
		arrow.stepNumber += 1;

		gl.uniform2f(translationUniformLocation, translation.x, translation.y);
		gl.uniform2f(arrowTranslationUniformLocation, arrow.translation.x, arrow.translation.y);
		gl.drawArrays(gl.TRIANGLES, 0, arrow.vertexData.length / 2);
	}

	function addArrowToBuffer(arrow) {
		arrow.bufferLink = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrow.bufferLink);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrow.vertexData), gl.STATIC_DRAW);
	}

	return { program: program, draw: draw };
}



/***/ })
/******/ ]);