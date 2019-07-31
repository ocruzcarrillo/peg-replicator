/*
ISC Omar Cruz Carrillo

peg_replicator.js

Is a tool with the finally to send data replication to an other Socket Server (UDP/TCP).
*/

// Import the Promise to send data via TCP
const { send_to_tcp_destination } = require('./../clients/client_tcp');
// Import the Promise to send data via UDP
const { send_to_udp_destination } = require('./../clients/client_udp');

var Promise = require('promise');

class PegReplicator {
	constructor(_socket, _data) {
		this.socket = _socket;
		this.data = _data;
		
		this._sends = Array();
		
		// With this flag I manage reconnection attempts at destinations
		this.reconnection_attempts = 0;
	}
	
	send_data() {
		// First build all Promises. For each connection on the SOURCE_PORT establish a connection to the primary and secondary destinations.
		destinations.map(dest => {
			// For TCP
			if (mode == 'TCP') {
				this._sends.push(send_to_tcp_destination(dest, this.data, this.socket));
			} else {
				this._sends.push(send_to_udp_destination(dest, this.data, this.socket));
			}
		});
		
		this.waitForReplications(this._sends);
	}
	
	waitForReplications(sends) {
		let peg = this;
		
		// peg._sends.map(send => console.log(send));
		
		// Managing traffic from source
		// Then wait for completion of this Promises to apply some Bussiness Rules
		// For traffic coming from the source, forward the traffic to the primary destination first, store the replies, if any, as expected responses.
		
		peg.promises = Promise.all(peg._sends).then(function(arrayOfResults) {
			// Store the replies
			responses = responses.concat(arrayOfResults);
			
			// If the responses differ. Forward the same traffic to each destination, if the responses differ (or there is no response). log a warning.
			var _firstResult = arrayOfResults[0], idx = 0, differ = false;
			arrayOfResults.map(result => {
				if (_firstResult.data != result.data) {
					console.warn("RESPONSES DIFFER WARNING", "The response (" + result.data + ") from destination: " + JSON.stringify(arrayOfResults[idx]) + ", differ to : " + _firstResult.data);
					differ = true;
				}
				
				idx++;
			});
			
			// Managing traffic from destinations. 			
			// if (!differ) {
				peg.sendToSource();
			// }
		}, function(err) {			
			if (err.code == "ECONNREFUSED" 
				|| err.code == "TIMEOUT") {
				/* 
				If any destination are down log a warning, and try it a reconnection, remember that
				UDP protocol don't have a ACK mechanism, for this reason only try it to reconnect for 10 attempts
				*/
				console.warn("DOWN WARNING", err);
				destinations.map(dest => {
					if (dest.port == err.destination.port) {
						// For TCP
						if (mode == 'TCP') {
							peg._sends.push(send_to_tcp_destination(dest, peg.data, ms_timeout_destinations));
						} else {
							peg._sends.push(send_to_udp_destination(dest, peg.data, ms_timeout_destinations));
						}
					}
				});
				
				// A connection with the primary destination is required to replicate the traffic.
				if (err.destination.primary) {
					peg.reconnection_attempts = 9999;
					console.warn("DOWN WARNING", "The PRIMARY destination is DOWN: " + err.destination);
				}
				
				if (peg.reconnection_attempts > 10) {
					// For TCP
					if (mode == 'TCP') {
							peg.socket.end();
						} 						
				} else {
					peg.reconnection_attempts++;
					console.log('peg.reconnection_attempts', peg.reconnection_attempts);
					peg.waitForReplications(peg._sends);
				}
			} else {
				// Notify for all error type's
				console.warn("Error: ", err);
			}
		}).catch(reason => { 
		  console.log("Catch: ", reason)
		});
	}
	
	sendToSource() {
		PegReplicator.clearResponses();
		
		// If there is a stored response, send it to the destination.
		if (mode == "TCP") {
			responses.map(res => {
				if (!res.sended && res.source == this.socket._peername) {
					// console.log("res", res);
					this.socket.write(res.data);
					res.sended = true;
					// console.log("res", res);
				}
			});
		} else {
		}
	}
	
	static clearResponses() {
		// console.log("clearResponses", responses.length);
		
		responses.map(res => {
			var existsSource = false;
			
			sources.map(s => {
				if (s.source == res.source) {
					existsSource = true;
		
					// For each source keep the last response		
					if (res.time > s.time) {
						// 30 seconds validation
						if (res.data == s.data
							&& (res.time - s.time) < 30000) {
							s.sended = res.sended = true;
						} else {
							s.sended = res.sended == undefined ? false : res.sended;
						}
					}
				}
			});
			
			if (!existsSource) {
				res.sended = false;
				sources.push(res);
			} else {
				// If other destinations send identical traffic. Do not forward the traffic to the source.
				sources.map(s => {
					if (res.sended == undefined || !res.sended) {
						if (s.source == res.source 
							&& res.data == s.data) {
							if (res.time <= s.time) {
								res.sended = true;
							} else {
								res.sended = false;
							}
						}
					}
				});
			}			
		});
		
		/*console.log("responses: \n", responses);
		console.log("sources: \n", sources);*/
	}
}

module.exports = {
	PegReplicator: PegReplicator
}
