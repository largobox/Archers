function vertexesForCircle (x, y, rX, rY) {
	let arr = [];

	for(let i = 0; i <= 360 ; i++){
		let j = i * Math.PI / 180;
		arr = arr.concat([rX * Math.sin(j) + x, rY * Math.cos(j) + y]);
		arr = arr.concat([x, y]);
	}

	return arr;
}


export {vertexesForCircle}