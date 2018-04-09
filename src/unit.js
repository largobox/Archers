class Unit {
	constructor (props) {
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = 20;
		this.height = 20;
		this.state = 'standing';

		const arr = this.dataForVertexShader();
		Unit.vertexArray = Unit.vertexArray.concat(arr);
		Unit.vertexCount += arr.length/2;
	}

	dataForVertexShader () {
		const data = [
			this.posX, this.posY,
			this.posX + this.width, this.posY,
			this.posX + this.width/2, this.posY - this.width
		];

		return data;
	}

	collisionShape () {
		return {x: this.posX, y: this.posY, w: this.width, h: this.height};
	}

}

Unit.vertexCount = 0;
Unit.vertexArray = [];

export {Unit};