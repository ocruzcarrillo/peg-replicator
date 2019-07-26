/*
ISC Omar Cruz Carrillo

All the Server and Socket Events was taken from: https://nodejs.org/api/net.html
*/

// Import the PEG Replicator
const { peg_replicator } = require('./../lib/peg_replicator');
// Import the TCP library
const net = require('net');

// Active Sockets
let sockets = [];

// Declare the function that manage the TCP Server 
function start_server(source_port, destinations) {
	const server = net.createServer();	
	
	// Listen over port declared in the .evn file
	server.listen(source_port);
	
	// Subscribed to the Server 'connection' event
	server.on('connection', function(sock) {
		// On receive ew connection, add  active Socket's
		console.log('TCP Server connection: ' + sock.remoteAddress + ':' + sock.remotePort);
		sockets.push(sock);

		// Subscribed to the Socket 'data' event
		sock.on('data', data => {
			console.log('TCP Socket data ' + sock.remoteAddress + ': ' + data);
			
			// Call the magic for the PEG Replication Tool
			peg_replicator(sock, data, destinations)
		});
		
		// Subscribed to the Socket 'connect' event
		sock.on('connect', () => {
			console.log('TCP Socket connect ' + sock.remoteAddress + ': ' + data);
		});

		// Subscribed to the Socket 'close' event
		sock.on('close', (err) => {
			// Update active sockets
			let index = sockets.findIndex(function(o) {
				return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			})
			if (index !== -1) sockets.splice(index, 1);
			console.log('TCP Socket close(' + err + '): ' + sock.remoteAddress + ' ' + sock.remotePort);
		});
		
		// Subscribed to the Socket 'error' event
		sock.on('error', (err) => {
		  console.error(`TCP Server error: `);
		  console.error(err);
		});
		
		// Subscribed to the Socket 'drain' event
		sock.on('drain', () => {
			console.log('TCP Socket drain ' + sock.remoteAddress);
			sock.resume();
		});
		
		// Subscribed to the Socket 'end' event
		sock.on('end', () => {
			console.log('TCP Socket end ' + sock.remoteAddress);
		});
		
		// Subscribed to the Socket 'lookup' event
		sock.on('lookup', () => {
			console.log('TCP Socket end ' + sock.remoteAddress);
		});
		
		// Subscribed to the Socket 'ready' event
		sock.on('ready', () => {
			console.log('TCP Socket ready ' + sock.remoteAddress);
		});
		
		// Subscribed to the Socket 'timeout' event
		sock.on('timeout', () => {
			console.log('TCP Socket timeout ' + sock.remoteAddress);
			sock.end('Timed out!');
		});
	});
	
	// Subscribed to the Server 'error' event
	server.on('error', (err) => {
	  console.error(`TCP Server error: `);
	  console.error(err);
	});
	
	// Subscribed to the Server 'close' event
	server.on('close', function(data) {
		console.log('close', data)
	});
	
	// Subscribed to the Server 'listening' event
	server.on('listening', () => {
	  const address = server.address();
	  console.log(`TCP Server listening ${address.address}:${address.port}`);
	});
}

// Exports function to manage TCP Socket Server
module.exports = {
	start_server: start_server
}
