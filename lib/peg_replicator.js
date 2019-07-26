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
	
	waitForReplications(_sends);
}

function waitForReplications(_sends) {
	// Then wait for completion of this Promises to apply some Bussiness Rules
	Promise.all(_sends).then(function(arrayOfResults) {
		console.log("Promise Result: ", arrayOfResults);
		
		// If the responses differ
		var _firstResult = arrayOfResults[0], idx = 0;
		arrayOfResults.map(result => {
			if (_firstResult != result) {
				console.warn("The response (" + result + ") from destination: " + JSON.stringify(destinations[idx]) + ", differ to : " + _firstResult);
			}
			
			idx++;
		});
		
		// Managing traffic from source
		
		// Managing traffic from destinations
	}, function(err) {
		console.warn("Promise Error", err);
		// If any destination are down log a warning, and try it a reconnection
		if (err.code == "ECONNREFUSED") {			
			console.log("reconnection_attempts", reconnection_attempts);
			console.log(err.port);
			// peg_replicator(_socket, _data, _destinations);
			
			for (dest in destinations) {
				if (dest.port == err.port) {
					if (socket.hasOwnProperty("_handle")
						&& socket._handle.hasOwnProperty("reading")) {
						_sends.push(send_to_tcp_destination(destinations[dest], data));
					} else {
						_sends.push(send_to_udp_destination(destinations[dest], data));
					}
				}
			}
			
			if (reconnection_attempts > 1000) {
				socket.end();
			} else {
				waitForReplications(_sends);
			}
			
			reconnection_attempts++;
		}
	});
}

module.exports = {
	peg_replicator: peg_replicator
}
