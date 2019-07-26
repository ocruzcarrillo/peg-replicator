/*
ISC Omar Cruz Carrillo
*/

// Import the environment variables from .env file
const { source_port, mode, destinations } = require('./config/config');
// Import the TCP Server Manager
const tcp_server = require('./servers/tcp_server');
// Import the UDP Server Manager
const udp_server = require('./servers/udp_server');

// Print the environment variables to Listen and forward data
console.log(`PEG Replicator Starts with:\nSOURCE_PORT: ${source_port} \nMODE: ${mode} \nDESTINATIONS:`); 
console.log(destinations); 

// Determine which mode server and start
if (mode == 'TCP') {
	tcp_server.start_server(source_port, destinations);
} else if (mode == 'UDP') {
	udp_server.start_server(source_port, destinations);
} else {
	console.warn(`${mode} MODE isn't recognized`);
}
