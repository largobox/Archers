const  canvas = document.getElementById('canvas'); // Глобальная переменная
const 		 gl = canvas.getContext('webgl'); // Глобальная переменная
canvas.width  = gl.canvas.clientWidth;
canvas.height = gl.canvas.clientHeight;

import {Player} from './player'
import {StaticObject} from './static_object'
import {Unit} from './unit'
import {Arrow} from './arrow'

import {createProgramForStatic} from './shader_programs/static'
import {createProgramForPlayer} from './shader_programs/player'
import {createProgramForUnits} from './shader_programs/units'
import {createProgramForArrows} from './shader_programs/arrows'

const collisionCnt = [];

const player = new Player({posX: canvas.width/2, posY: canvas.height/2, canvas: canvas, collisions: collisionCnt});
const obj1 = new StaticObject({posX: 350, posY: 550, width: 400, height: 40});
const obj2 = new StaticObject({posX: 210, posY: 150, width: 20, height: 320});
const obj3 = new StaticObject({posX: 510, posY: 210, width: 20, height: 260});
const obj4 = new StaticObject({posX: 210, posY: 120, width: 320, height: 20});
const obj5 = new StaticObject({posX: 210, posY: 480, width: 320, height: 20});

const unit1 = new Unit({posX: 300, posY: 50});
const unit2 = new Unit({posX: 700, posY: 360});

collisionCnt.push(obj1.collisionShape());
collisionCnt.push(obj2.collisionShape());
collisionCnt.push(obj3.collisionShape());
collisionCnt.push(obj4.collisionShape());
collisionCnt.push(obj5.collisionShape());

collisionCnt.push(unit1.collisionShape());
collisionCnt.push(unit2.collisionShape());

const programForPlayer = createProgramForPlayer(gl, Player.vertexArray);
const programForStatic = createProgramForStatic(gl, StaticObject.vertexArray);
const programForUnits = createProgramForUnits(gl, Unit.vertexArray);
const programForArrows = createProgramForArrows(gl);

function drawScene () {
	gl.clearColor(0.0, 0.0, 0.0, .1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(programForPlayer.program);
	programForPlayer.draw(player.figures);

	gl.useProgram(programForStatic.program);
	programForStatic.draw(player.translation, StaticObject.vertexArray.length/2);

	gl.useProgram(programForUnits.program);
	programForUnits.draw(player.translation, Unit.vertexArray.length/2);

	gl.useProgram(programForArrows.program);
	programForArrows.draw(player.translation, Arrow);	

	requestAnimationFrame(drawScene);
}


function checkWebGL () {
	if (!gl) {
		alert('Ваш браузер не поддерживает WebGL');
		return;
	}

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	console.log('Resolution: ', gl.canvas.width, gl.canvas.height);
}


export {checkWebGL, drawScene, player}