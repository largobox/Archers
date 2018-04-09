const server = require('http').createServer();
const fs = require('fs');
const WebSocket = require('ws');
const serverSocket = new WebSocket.Server({port: 4000});
const sockets = []

server.on('request', (req, res) => {
		console.log(req.url);

		if (req.url === '/') {
			const html = fs.readFileSync('index.html','utf8');
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(html);
		}

		if (req.url === '/styles.css') {
			const css = fs.readFileSync('styles.css','utf8');
			res.writeHead(200, {'Content-Type': 'text/css'});
			res.end(css);
		}

		if (req.url === '/build.js') {
			const css = fs.readFileSync('build.js','utf8');
			res.writeHead(200, {'Content-Type': 'text/javascript'});
			res.end(css);
		}
});

server.listen(3000, '127.0.0.1', () => {
	console.log('Сервер работает');
});

serverSocket.on('connection', (ws) => {
		ws.send('Hey!');

		ws.onmessage = (response) => {
				console.log(response.data);
		}
});