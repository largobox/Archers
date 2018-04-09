import {createShader, createProgram} from './init'


function createProgramForUnits (gl, vertexArray) {
	const vertexShaderText = document.getElementById('units-vertex-shader').text;
	const fragmentShaderText = document.getElementById('units-fragment-shader').text;

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = createProgram(gl, vertexShader, fragmentShader);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const positionAttribLocation = gl.getAttribLocation(program, 'a_vertexPosition');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');

	const positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	function draw (translation, vertexCount) {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		gl.vertexAttribPointer(
			positionAttribLocation, 
			2, 
			gl.FLOAT, 
			gl.FALSE, 
			2 * Float32Array.BYTES_PER_ELEMENT, 
			0 * Float32Array.BYTES_PER_ELEMENT
		);

		gl.uniform2f(translationUniformLocation, translation.x, translation.y);
		gl.drawArrays(gl.TRIANGLES, 0, vertexCount);	
	}

	return {program: program, draw: draw};
}


export {createProgramForUnits}