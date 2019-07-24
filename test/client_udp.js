const { source_port, mode, destinations } = require('./../config');
const host = '127.0.0.1';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var message = new Buffer("Hello From Testing UDP Client ");

client.send(message, 0, message.length, source_port, host, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + host +':'+ source_port);
  client.close();
});