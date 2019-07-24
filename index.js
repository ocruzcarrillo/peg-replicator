const { source_port, mode, destinations } = require('./config');
const tcp_server = require('./tcp_server');
const udp_server = require('./udp_server');

// Print the environment variables to Listen and forward data
console.log(`PEG Replicator Starts with:\nSOURCE_PORT: ${source_port} \nMODE: ${mode} \nDESTINATIONS:`); 
console.log(destinations); 

// Determine which mode server
var server;
if (mode == 'TCP') {
	server = tcp_server.start_server(source_port, destinations);
} else if (mode == 'UDP') {
	server = udp_server.start_server(source_port, destinations);
} else {
	console.warn(`${mode} MODE isn't recognized`);
}
