const { source_port, mode, destinations } = require('./../config/config');
var buffer = require('buffer');
const host = '127.0.0.1';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var message = Buffer.from("Hello From Testing UDP Client ");

client.on('message',function(msg){
	console.log('Server Says : ' + msg);
	client.close();
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('error', function(err) {
    console.log('Error: ', err);
});

client.send(message, 0, message.length, source_port, host, function(err) {
  if (err) throw err;
  console.log('UDP message sent to ' + host +':'+ source_port);
  // console.log(client.address());
});
