function createShader (gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	console.error('Shader ERROR: ', gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}


function createProgram (gl, vShader, fShader) {
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


export {createShader, createProgram}