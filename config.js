// config.js

// Load library to read .env file with environment variables
const dotenv = require('dotenv');

// Load all .env content to process.env variable
dotenv.config();

// Transform DESTINATIONS csv format to Json Object
destinations = process.env.DESTINATIONS.split(',').map( e => {
	_e = {
		ip: e.split(':')[0],
		port: e.split(':')[1]
	}
	return _e
})

// Exports environment variables
module.exports = {
  source_port: process.env.SOURCE_PORT,
  mode: process.env.MODE,
  destinations: destinations
};