/*
ISC Omar Cruz Carrillo

index.js
*/

// Import the environment variables from .env file
const config = require('./config/config');
// Import the TCP Server Manager
const tcp_server = require('./servers/tcp_server');
// Import the UDP Server Manager
const udp_server = require('./servers/udp_server');

// Manage environment variables as global variables in App
source_port = config.source_port;
mode = config.mode;
destinations = config.destinations;
ms_timeout_destinations = config.ms_timeout_destinations;
server = null;

// Store the responses from destinations
responses = Array();
sources = Array();

// For a extra credit
whiteList = [];
blackList = [];

// Print the environment variables to Listen and forward data
console.log(`PEG Replicator Starts with:\nSOURCE_PORT: ${source_port} \nMODE: ${mode} \nDESTINATIONS:`); 
console.log(destinations); 

// Determine which mode server and start
if (mode == 'TCP') {
	tcp_server.start_server(ms_timeout_destinations);
} else if (mode == 'UDP') {
	udp_server.start_server(ms_timeout_destinations);
} else {
	console.warn(`${mode} MODE isn't recognized`);
}