/*
ISC Omar Cruz Carrillo

client_tcp.js

Client to reply data at TCP Destination Server
*/

const net = require('net');
var PromiseFancyError = require ('./../lib/promise_fancy_error');
var Promise = require('promise');
var moment = require('moment');

function send_to_destination(destination, data, socket) {
	console.log('send_to_tcp_destination', destination);
	const client = new net.Socket();
	
	// Create the Promise to send data reply
	return new Promise(function(resolve, reject) {
		client.connect(destination.port, destination.host, function() {
			console.log('Connected');
		});

		client.on('data', function(data) {
			client.end();
			resolve({
				data: String(data),
				time: moment().valueOf(),
				destination: destination,
				source: socket._peername
			});
		});

		client.on('close', function() {
			resolve(null);
		});
		
		client.on('error', function(err) {
			client.end();
			reject(new PromiseFancyError(err, err.code, destination, {source: socket._peername}));
		});
		
		client.write(data);
		
		setTimeout(function() {
			client.destroy();
			reject(new PromiseFancyError("Send to destination timed out after: " + ms_timeout_destinations + " ms", "TIMEOUT", destination, {source: socket._peername}));
		}, ms_timeout_destinations);
	});
}

module.exports = {
	send_to_tcp_destination: send_to_destination
}