/*
ISC Omar Cruz Carrillo

All the Server and Socket Events was taken from: https://nodejs.org/api/dgram.html
*/

// Import the PEG Replicator
const { peg_replicator } = require('./../lib/peg_replicator');
// Import UDP ibrary
const dgram = require('dgram');

// Managing the UDP Server
function start_server(source_port, destinations) {
	const server = dgram.createSocket('udp4');
	
	// Subscribed to the Server 'error' event
	server.on('error', (err) => {
	  console.error(`UDP Server error: `);
	  console.error(err);
	});
	
	// Subscribed to the Server 'message' event
	server.on('message', (msg, rinfo) => {
	  console.log(`UDP Server message: ${msg} from ${rinfo.address}:${rinfo.port}`);
	  // Call the magic for the PEG Replication Tool
	  peg_replicator(rinfo, String(msg), destinations)
	});

	// Subscribed to the Server 'listening' event
	server.on('listening', () => {
	  const address = server.address();
	  console.log(`UDP Server listening ${address.address}:${address.port}`);
	});
	
	// Subscribed to the Server 'close' event
	server.on('close', (msg, rinfo) => {
	  console.log(`UDP Server close: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});
	
	// Subscribed to the Server 'connect' event
	server.on('connect', (msg, rinfo) => {
	  console.log(`UDP Server connect: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});
	
	// Listen over port declared in the .evn file
	server.bind(source_port);
}

// Exports function to manage UDP Socket Server
module.exports = {
	start_server: start_server
}