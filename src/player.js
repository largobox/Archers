import {Arrow} from './arrow'
import {vertexesForCircle} from './draw_lib/core'


class Player {
	constructor (props) {
		this.collisions = props.collisions;
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = 20;
		this.height = 20;
		this.state = 'standing';
		this.stepLength = 4;
		this.translation = { x: 0, y: 0 }
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

		addEventListener('keypress', (e) => this.changeMoveDirection(e, true) );
		addEventListener('keyup', (e) => this.changeMoveDirection(e, false) );
		props.canvas.addEventListener('mousemove', (e) => this.changeDirection(e) );	
		canvas.addEventListener('click', (e) => this.shot(e) );
	}

	changeMoveDirection(e, ind) {
		switch(e.key){
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

		if(ind)
			this.changeState('moving');

		if(!this.moveDirection.up && !this.moveDirection.down && !this.moveDirection.left && !this.moveDirection.right){
			this.changeState('standing');
			this.figures[1].translationY = 0;
			this.figures[2].translationY = 0;
			this.figures[3].translationY = 0;
			this.figures[4].translationY = 0;
			this.moveIter = 5;
		}
	}

	setSocket (ws) {
		this.ws = ws;
	}

	step () {
		this.moveIter += this.legDirection;

		if(this.moveIter == this.moveCicle || this.moveIter == 0){
			this.legDirection *= -1;
		}

		this.figures[1].translationY -= this.legDirection*0.6;
		this.figures[2].translationY += this.legDirection*0.6;
		this.figures[3].translationY += this.legDirection*0.4;
		this.figures[4].translationY -= this.legDirection*0.4;

		if(this.moveDirection.up){
			this.translation.y += this.stepLength;
			if(this.checkCollisions()){
				this.translation.y -= this.stepLength;
				return;
			}
		}

		if(this.moveDirection.down){
			this.translation.y -= this.stepLength;
			if(this.checkCollisions()){
				this.translation.y += this.stepLength;
				return;
			}
		}

		if(this.moveDirection.left){
			this.translation.x += this.stepLength;
			if(this.checkCollisions()){
				this.translation.x -= this.stepLength;
				return;
			}			
		}

		if(this.moveDirection.right){
			this.translation.x -= this.stepLength;
			if(this.checkCollisions()){
				this.translation.x += this.stepLength;
				return;
			}
		}

		const str = 'X: ' + this.translation.x + ' Y: ' + this.translation.y;
		
		this.ws.send(str);
	}

	shot(e) {
		new Arrow({
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
		if(this.state == value) 
			return;

		this.state = value;

		if(this.state == 'moving'){
			this.moveTimer = setInterval( () => this.step(), 20);
		}

		if(this.state == 'standing')
			clearInterval(this.moveTimer);
	}

	changeDirection (e) {
		this.cursorX = e.offsetX - this.posX;
		this.cursorY = e.offsetY - this.posY;

		const r = Math.sqrt(this.cursorX*this.cursorX + this.cursorY*this.cursorY);

		this.rotationX = -this.cursorX/r;
		this.rotationY = this.cursorY/r;

		for(let i = 0; i < this.figures.length; i++){
			this.figures[i].rotationX = this.rotationX;
			this.figures[i].rotationY = this.rotationY;
		}

	}

	dataForVertexShader () {
		let data = {};

		const body = vertexesForCircle(this.posX, this.posY, 20, 20);
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

		const leftLeg = vertexesForCircle(this.posX - 10, this.posY + 14, 6, 10);

		this.figures.push({
			bufferName: 'leftLeg',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: leftLeg.length
		});

		const rightLeg = vertexesForCircle(this.posX + 10, this.posY + 14, 6, 10);

		this.figures.push({
			bufferName: 'rightLeg',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: rightLeg.length
		});

		const leftHand = vertexesForCircle(this.posX - 22, this.posY + 0, 4, 4);

		this.figures.push({
			bufferName: 'leftHand',
			translationX: 0,
			translationY: 0,
			rotationX: this.rotationX,
			rotationY: this.rotationY,
			vertexCount: leftHand.length
		});

		const rightHand = vertexesForCircle(this.posX + 22, this.posY + 0, 4, 4);

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
		}

		return data;
	}

	collisionShape () {
		return {x: this.posX - this.width - this.translation.x, y: this.posY - this.height - this.translation.y, w: this.width*2, h: this.height*2};
	}

	checkCollisions () {
		const rect = this.collisionShape();

		for (let i = 0; i < this.collisions.length; i++) {

			if (rect.x < this.collisions[i].x && rect.y < this.collisions[i].y) {
				const includeX = rect.x + rect.w >= this.collisions[i].x 
											 && rect.x + rect.w <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y + rect.h >= this.collisions[i].y 
											 && rect.y + rect.h <= this.collisions[i].y + this.collisions[i].h;


				if(includeX && includeY)
					return true;
			}

			if (rect.x < this.collisions[i].x && rect.y > this.collisions[i].y) {
				const includeX = rect.x + rect.w >= this.collisions[i].x 
											 && rect.x + rect.w <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y >= this.collisions[i].y 
											 && rect.y <= this.collisions[i].y + this.collisions[i].h;

				if(includeX && includeY)
					return true;
			}

			if (rect.x > this.collisions[i].x && rect.y < this.collisions[i].y) {
				const includeX = rect.x >= this.collisions[i].x 
											 && rect.x <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y + rect.h >= this.collisions[i].y 
											 && rect.y + rect.h <= this.collisions[i].y + this.collisions[i].h;

				if(includeX && includeY)
					return true;
			}

			if (rect.x > this.collisions[i].x && rect.y > this.collisions[i].y) {
				const includeX = rect.x >= this.collisions[i].x 
											 && rect.x <= this.collisions[i].x + this.collisions[i].w;
				const includeY = rect.y >= this.collisions[i].y 
											 && rect.y <= this.collisions[i].y + this.collisions[i].h;

				if(includeX && includeY)
					return true;
			}

			
		}

		return false;
	}

}

Player.vertexArray = [];

export {Player};