/*
ISC Omar Cruz Carrillo
*/

const net = require('net');

function send_to_destination(destination, data) {
	console.log('send_to_tcp_destination', destination);
	const client = new net.Socket();
	
	return new Promise(function(resolve, reject) {
		client.connect(destination.port, destination.host, function() {
			console.log('Connected');
		});

		client.on('data', function(data) {
			client.end();
			resolve(String(data));
		});

		client.on('close', function() {
			resolve("Connection closed");
		});
		
		client.on('error', function(err) {
			client.end();
			reject(err);
		});
		
		client.write(data);
	});
}

module.exports = {
	send_to_tcp_destination: send_to_destination
}