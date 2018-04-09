class StaticObject {
	constructor (props) {
		this.posX = props.posX;
		this.posY = props.posY;
		this.width = props.width;
		this.height = props.height;

		const arr = this.dataForVertexShader();
		StaticObject.vertexArray = StaticObject.vertexArray.concat(arr);
		StaticObject.vertexCount += arr.length/2;
	}

	dataForVertexShader () {
		const data = [
			this.posX, 							this.posY,
			this.posX + this.width, this.posY,
			this.posX + this.width, this.posY + this.height,
			this.posX + this.width, this.posY + this.height,
			this.posX, this.posY + this.height,
			this.posX, this.posY
		];

		return data;
	}

	collisionShape () {
		return {x: this.posX, y: this.posY, w: this.width, h: this.height};
	}
	
}

StaticObject.vertexCount = 0;
StaticObject.vertexArray = [];

export {StaticObject};