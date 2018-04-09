class Arrow {
	constructor(props) {
		this.id = Arrow.count;
		Arrow.count += 1; 
		this.posX = props.startPos.x;
		this.posY = props.startPos.y;
		this.size = 8;
		this.cursorPosX = props.cursorPos.x;
		this.cursorPosY = props.cursorPos.y;
		this.movingTimer = setInterval( () => this.step(), 16);
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

		if(this.cursorPosY < this.posY)
			ld *= -1;

		this.stepLengthX = al / this.stepMax;
		this.stepLengthY = ld / this.stepMax;
		this.translation = {x: 0, y: 0};

		Arrow.all.push(this);
	}

	step() {
		if(this.stepNumber > this.stepMax){
			clearInterval(this.movingTimer);
			return;
		}

		this.stepNumber += 1;
		this.posX += this.stepLengthX;
		this.posY += this.stepLengthY;
	}

	dataForVertexShader () {
		const data = [
			this.posX, this.posY,
			this.posX, this.posY + this.size,
			this.posX + this.size, this.posY + this.size,
			this.posX + this.size, this.posY + this.size,
			this.posX + this.size, this.posY,
			this.posX, this.posY
		];

		return data;
	}	
}

Arrow.all = [];
Arrow.count = 0;

export {Arrow}