/*
ISC Omar Cruz Carrillo

peg_replicator

Is a tool with the finally to send data replication to an other Socket Server (UDP/TCP).
*/

// Import the Promise to send data via TCP
const { send_to_tcp_destination } = require('./../clients/client_tcp');
// Import the Promise to send data via UDP
const { send_to_udp_destination } = require('./../clients/client_udp');
var socket, data, destinations;

// With this flag I manage reconnection attempts at destinations
var reconnection_attempts = 0;

function peg_replicator(_socket, _data, _destinations) {
	socket = _socket;
	data = _data;
	destinations = _destinations;
	
	_sends = Array();
	
	// First build all Promises
	for (dest in destinations) {
		if (socket.hasOwnProperty("_handle")
			&& socket._handle.hasOwnProperty("reading")) {
			_sends.push(send_to_tcp_destination(destinations[dest], data));
		} else {
			_sends.push(send_to_udp_destination(destinations[dest], data));
		}
	}
	
	// Then wait for completion of this Promises to apply some Bussiness Rules
	Promise.all(_sends).then(function(arrayOfResults) {
		console.log(arrayOfResults);
		
		// Managing traffic from source
		
		// Managing traffic from destinations
	}, function(err) {
		console.log(err);
		// If any destination are down log a warning, and try it a reconnection
	});
}

module.exports = {
	peg_replicator: peg_replicator
}
