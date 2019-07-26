/*
ISC Omar Cruz Carrillo
*/

var dgram = require('dgram');
var buffer = require('buffer');

function send_to_destination(destination, data) {
	console.log('send_to_udp_destination', destination);
	var client = dgram.createSocket('udp4');
	var message = Buffer.from(data);
	
	return new Promise(function(resolve, reject) {
		client.on('message',function(msg){
			client.close();
			resolve(String(msg));
		});

		client.on('close', function() {
			resolve("Connction closed");
		});
		
		client.on('error', function(err) {
			client.close();
			reject(err);
		});
		
		client.send(message, 0, message.length, destination.port, destination.host, function(err) {
		  if (err) {
			  client.close();
			  reject(Error(err));
		  }
		});
	});
}

module.exports = {
	send_to_udp_destination: send_to_destination
}