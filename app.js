import {checkWebGL, drawScene, player} from './src/webgl'

checkWebGL();
drawScene();

function setStatus(value) {
	const el = document.getElementById('status');
	el.innerHTML = value;
}

const ws = new WebSocket('ws://localhost:4000');

player.setSocket(ws);

ws.onopen = () => setStatus('ONLINE');
ws.onclose = () => setStatus('DISCONNECTED');
ws.onmessage = (response) => {
		console.log(response);
}