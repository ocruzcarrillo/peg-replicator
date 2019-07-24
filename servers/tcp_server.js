const { peg_replicator } = require('./../lib/peg_replicator');
const net = require('net');

let sockets = [];

function start_server(source_port, destinations) {
	const server = net.createServer();	
	
	server.listen(source_port);
	
	server.on('connection', function(sock) {
		console.log('TCP Server connection: ' + sock.remoteAddress + ':' + sock.remotePort);
		sockets.push(sock);

		sock.on('data', function(data) {
			console.log('TCP Socket data ' + sock.remoteAddress + ': ' + data);
		});
		
		sock.on('connect', function(data) {
			console.log('TCP Socket connect ' + sock.remoteAddress + ': ' + data);
		});

		sock.on('close', function(data) {
			let index = sockets.findIndex(function(o) {
				return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			})
			if (index !== -1) sockets.splice(index, 1);
			console.log('TCP Socket close: ' + sock.remoteAddress + ' ' + sock.remotePort);
		});
		
		sock.on('error', (err) => {
		  console.error(`TCP Server error: `);
		  console.error(err);
		});
		
		sock.on('drain', function(data) {
			console.log('TCP Socket drain ' + sock.remoteAddress + ': ' + data);
		});
		
		sock.on('end', function(data) {
			console.log('TCP Socket end ' + sock.remoteAddress + ': ' + data);
		});
		
		sock.on('lookup', function(data) {
			console.log('TCP Socket end ' + sock.remoteAddress + ': ' + data);
		});
		
		sock.on('ready', function(data) {
			console.log('TCP Socket ready ' + sock.remoteAddress + ': ' + data);
		});
		
		sock.on('timeout', function(data) {
			console.log('TCP Socket timeout ' + sock.remoteAddress + ': ' + data);
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
