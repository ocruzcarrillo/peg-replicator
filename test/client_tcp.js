const { source_port, mode, destinations } = require('./../config/config');
const net = require('net');
const client = new net.Socket();
const host = '127.0.0.1';

client.connect(source_port, host, function() {
    console.log('Connected');
    client.write("Hello From Testing TCP Client " + client.address().address);
	client.end();
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
