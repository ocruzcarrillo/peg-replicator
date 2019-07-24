const { peg_replicator } = require('./../lib/peg_replicator');
const net = require('net');

let sockets = [];

function start_server(source_port, destinations) {
	const server = net.createServer();	
	
	server.listen(source_port);
	
	server.on('connection', function(sock) {
		console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
		sockets.push(sock);

		sock.on('data', function(data) {
			console.log('DATA ' + sock.remoteAddress + ': ' + data);
		});

		sock.on('close', function(data) {
			let index = sockets.findIndex(function(o) {
				return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			})
			if (index !== -1) sockets.splice(index, 1);
			console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
		});
		
		sock.on('error', (err) => {
		  console.error(`TCP Server error: `);
		  console.error(err);
		});
	});
	
	server.on('error', (err) => {
	  console.error(`TCP Server error: `);
	  console.error(err);
	});
	
	server.on('close', function(data) {
		console.log('close', data)
	});
	
	server.on('listening', () => {
	  const address = server.address();
	  console.log(`TCP Server listening ${address.address}:${address.port}`);
	});
}

module.exports = {
	start_server: start_server
}
