/*
ISC Omar Cruz Carrillo

client_udp.js

Client to reply data at UDP Destination Server
*/

var dgram = require('dgram');
var buffer = require('buffer');
var PromiseFancyError = require ('./../lib/promise_fancy_error');
var Promise = require('promise');
var moment = require('moment');

function send_to_destination(destination, data, socket) {
	console.log('send_to_udp_destination', destination);
	var client = dgram.createSocket('udp4');
	var message = Buffer.from(data);
	
	// Create the Promise to send data reply
	return new Promise(function(resolve, reject) {
		client.on('message',function(msg){
			client.close();
			resolve({
				data: String(msg),
				time: moment().valueOf(),
				destination: destination,
				source: socket
			});
		});

		client.on('close', function() {
			resolve(null);
		});
		
		client.on('error', function(err) {
			client.close();
			reject(new PromiseFancyError(err, err.code, destination, {source: socket}));
		});
		
		client.send(message, 0, message.length, destination.port, destination.host, function(err) {
		  if (err) {
			  client.close();
			  reject(new PromiseFancyError(err, err.code, destination, {source: socket}));
		  }
		});
		
		setTimeout(function() {
			reject(new PromiseFancyError("Send to destination timed out after: " + ms_timeout_destinations + " ms", "TIMEOUT", destination));
		}, ms_timeout_destinations);
	});
}

module.exports = {
	send_to_udp_destination: send_to_destination
}