import {createShader, createProgram} from './init'


function createProgramForArrows (gl, vertexArray) {
	const vertexShaderText = document.getElementById('arrows-vertex-shader').text;
	const fragmentShaderText = document.getElementById('arrows-fragment-shader').text;

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
	const program = createProgram(gl, vertexShader, fragmentShader);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const positionAttribLocation = gl.getAttribLocation(program, 'a_vertexPosition');
	const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
	const arrowTranslationUniformLocation = gl.getUniformLocation(program, 'u_arrowTranslation');
	let arrowCount = 0;

	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	function draw (playerTranslation, Arrow) {
		if(Arrow.all.length != arrowCount){
			for(let i = arrowCount; i < Arrow.all.length; i++){
				addArrowToBuffer(Arrow.all[i]);
			}
			arrowCount = Arrow.all.length;
		}

		for(let i = 0; i < Arrow.all.length; i++){
			if(Arrow.all[i].stepNumber < Arrow.all[i].stepMax){
				drawArrow(playerTranslation, Arrow.all[i]);
			} else {
				Arrow.all.splice(i, 1);
			}
		}		
	}

	function drawArrow (translation, arrow) {
		gl.bindBuffer(gl.ARRAY_BUFFER, arrow.bufferLink);

		gl.vertexAttribPointer(
			positionAttribLocation, 
			2, 
			gl.FLOAT, 
			gl.FALSE, 
			2 * Float32Array.BYTES_PER_ELEMENT, 
			0 * Float32Array.BYTES_PER_ELEMENT
		);

		arrow.translation.x += arrow.stepLengthX;
		arrow.translation.y += arrow.stepLengthY;
		arrow.stepNumber += 1;

		gl.uniform2f(translationUniformLocation, translation.x, translation.y);
		gl.uniform2f(arrowTranslationUniformLocation, arrow.translation.x, arrow.translation.y);
		gl.drawArrays(gl.TRIANGLES, 0, arrow.vertexData.length/2);	
	}

	function addArrowToBuffer (arrow) {
		arrow.bufferLink = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, arrow.bufferLink);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrow.vertexData), gl.STATIC_DRAW);
	}	

	return {program: program, draw: draw};
}


export {createProgramForArrows}