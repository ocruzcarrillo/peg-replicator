/*
ISC Omar Cruz Carrillo

promise_fancy_error.js

Provide a personalyzed Error Type 
*/

class PromiseFancyError extends Error {
	constructor(args, code, destination, source){
        super(args);
		
		this.code = code;
		this.destination = destination;
		this.source = source;
    }
}

module.exports = PromiseFancyError;