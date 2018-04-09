import {createShader, createProgram} from './init'


function createProgramForPlayer (gl, vertexArray) {
	const vertexShaderText = document.getElementById('player-vertex-shader').text;
	const fragmentShaderText = document.getElementById('player-fragment-shader').text;

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = createProgram(gl, vertexShader, fragmentShader);

	const positionAttribLocation = gl.getAttribLocation(program, 'vertex_Position');
	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const	rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation');
	const	translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
	const playerScaleUniformLocation = gl.getUniformLocation(program, 'u_playerScale');

	const positionBuffer = {
		body: gl.createBuffer(),
		leftHand: gl.createBuffer(),
		rightHand: gl.createBuffer(),
		leftLeg: gl.createBuffer(),
		rightLeg: gl.createBuffer()
	}

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

	function draw (figures) {
		for(let i = 0; i < figures.length; i++){
			drawFigure(figures[i]);
		}
	}

	function drawFigure (figure) {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[figure.bufferName]);

		gl.vertexAttribPointer(
			positionAttribLocation, 
			2, 
			gl.FLOAT, 
			gl.FALSE, 
			2 * Float32Array.BYTES_PER_ELEMENT, 
			0 * Float32Array.BYTES_PER_ELEMENT
		);

		if(playerScaleIter >= 240 || playerScaleIter <= 0){
			playerScaleDirection = playerScaleDirection * (-1);
		}
		playerScaleIter += 1 * playerScaleDirection;

		gl.uniform2f(translationUniformLocation, figure.translationX, figure.translationY);
		// gl.uniform2f(rotationUniformLocation, 0, 1);
		gl.uniform2f(rotationUniformLocation, figure.rotationX, figure.rotationY);
		gl.uniform2f(playerScaleUniformLocation, 1, 1);
		// gl.uniform2f(playerScaleUniformLocation, 0.7 + 0.002 * playerScaleIter, 0.7 + 0.002 * playerScaleIter);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, figure.vertexCount/2);
	}

	return {program: program, draw: draw};
}


export {createProgramForPlayer}