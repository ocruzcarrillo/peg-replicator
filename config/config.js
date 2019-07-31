/*
ISC Omar Cruz Carrillo

config.js
*/

// Load library to read .env file with environment variables
const dotenv = require('dotenv');

// Load all .env content to process.env variable
dotenv.config();

// Transform DESTINATIONS csv format to Json Object
var primary = true;
destinations = process.env.DESTINATIONS.split(',').map( e => {
	_e = {
		host: e.split(':')[0],
		port: e.split(':')[1],
		primary: primary
	}
	
	primary = false
	
	return _e
})

// Exports environment variables
module.exports = {
  source_port: process.env.SOURCE_PORT,
  mode: process.env.MODE,
  destinations: destinations,
  ms_timeout_destinations: process.env.MS_TIMEOUT_DESTINATIONS
};