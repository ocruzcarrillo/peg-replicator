const { peg_replicator } = require('./../lib/peg_replicator');
const dgram = require('dgram');

let sockets = [];

function start_server(source_port, destinations) {
	const server = dgram.createSocket('udp4');
	
	server.on('error', (err) => {
	  console.error(`UDP Server error: `);
	  console.error(err);
	});
	
	server.on('message', (msg, rinfo) => {
	  console.log(`UDP Server message: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});

	server.on('listening', () => {
	  const address = server.address();
	  console.log(`UDP Server listening ${address.address}:${address.port}`);
	});
	
	server.on('close', (msg, rinfo) => {
	  console.log(`UDP Server close: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});
	
	server.on('connect', (msg, rinfo) => {
	  console.log(`UDP Server connect: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});
	
	server.bind(source_port);
}

module.exports = {
	start_server: start_server
}