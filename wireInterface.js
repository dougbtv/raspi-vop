// -----------------------------------------------------------------
// -- Wire Interface : Performs the i2c handling over the wire.
// -----------------------------------------------------------------

// Don't forget the i2c module docs @ https://github.com/kelly/node-i2c

// Here it takes the wire object, from the i2c module, and constants module.

module.exports = function(wire,constants) {

	this.last_error = '';

	// ---------------------------------------------------------
	// -- patTheDog : Pat the watchdog. Woof! woof! good dog.

	this.patTheDog = function(callback) {

		this.issueCommand(constants.CMD_PAT_WATCHDOG,0,true,function(err) {

			// Handle potential errors.			
			if (err) {
				this.errorMessage('Damn, watchdog pat error while trying to pat',err);
			}

			// Return in a callback.
			callback && callback.call( this, err );

		});

	};

	// ---------------------------------------------------------
	// -- ignitionLastChanged : Get the last time the ignition was changed.
	// -- Takes in_minutes as a parameter. If in_minutes is true, returns the time in minutes.
	// -- Maximum for seconds is approximately 18 hours. (before it rolls over)
	// -- Maximum for minutes is approximately 50 days.  (dittos)

	this.ignitionLastChanged = function(in_minutes,callback) {

		// Set the command based on 
		if (in_minutes) {
			cmd = constants.CMD_GET_LAST_IGNITION_CHANGE_MINUTES;
		} else {
			cmd = constants.CMD_GET_LAST_IGNITION_CHANGE_SECONDS;
		}

		this.issueCommand(cmd,0,true,function(err,res) {

			// Handle potential errors.			
			if (err) {
				this.errorMessage('Issue asking for ignitionLastChanged',err);
			}

			// Return in a callback.
			callback && callback.call( this, res, err );

		});


	};


	// ---------------------------------------------------------
	// -- getIgnitionState : Returns the state of the ignition, true = on, false = off.
	// -- call-back example: function(state,error) 
	
	this.getIgnitionState = function(callback) {

		// Note that I state "true" for the is_int parameter, it's because it's boolean, we don't need both bytes.
		this.issueCommand(constants.CMD_GET_IGNITION_STATE,0,true,function(err,res) {

			// Handle potential errors.			
			if (err) {
				this.errorMessage('Issue processing getIgnitionState',err);
			}

			state = false;
			if (res > 0) {
				state = true;
			}

			// Return in a callback.
			callback && callback.call( this, state, err);


		});

	};


	// ---------------------------------------------------------
	// -- issueCommand : Sends a command over i2c. 
	// -- This is the main handler for sending a command, other methods call this.

	this.issueCommand = function(command,parameters_in,is_int,callback) {

		// Here's our error flag
		is_error = false;

		// Let's process the parameters_in.
		if (parameters_in instanceof Array) {
			// If it's an array, we'll use the two bytes.
			parameters = parameters_in;
		} else {
			// Otherwise, for convenience you can send an int up to 65,535 and we'll convert to two bytes.
			parameters = new Buffer(2);
			// Go ahead and write that int to the buffer.
			parameters.writeUInt16BE(parameters_in,0);
		}

		if (constants.DEBUG) {
			console.log("Param buffer",parameters);
		}

		// Firstly, we write the first three bytes of the command.
		// The first byte is the command itself.
		// The next are two parameter bytes.
		// Note, it will take a number from 0-255 and pack it as a byte automatically.

		if (command != constants.END_OF_COMMAND) {

			wire.writeBytes(command, [parameters[0], parameters[1]], function(err) {

				if (!err) {

					// Finally, we write the single end of command byte, and make the request for data.
					// We pass in the end of command (usually 0x0A) byte, and the number of bytes we expect (usually 4)
			        wire.readBytes(constants.END_OF_COMMAND,constants.NUMBER_RETURN_BYTES,function(err, buf) {

						if (!err) {

							if (buf.length == constants.NUMBER_RETURN_BYTES) {

								this.debug(buf,'Read from command.');
								
								// For what we need, we can dig into the buffer like so.
								// There's more fleshed out modules, but, we're talking a few bytes.
								// http://nodejs.org/api/buffer.html
								error = buf.readUInt8(0);
								readback_command = buf.readUInt8(1);

								// Return a 2-byte int if requested. Else, return "two bytes"
								if (is_int) {
									return_value = buf.readUInt16BE(2);
								} else {
									return_value = [buf.readUInt8(2),buf.readUInt8(3)];
								}

								this.debug(error,'error');
								this.debug(readback_command,'readback_command');
								this.debug(return_value,'return_value');

								// We check that we got back the command we sent (it's kind of our error checking byte.)
								if (readback_command == command) {


									// Execute the callback if the script asked for it.
									callback && callback.call( this, error, return_value );

								} else {

									this.errorMessage('readback_command not returned properly',readback_command);
									is_error = true;

								}

							} else {

								this.errorMessage('Unexpected buffer length',buf);
								is_error = true;

							}

						} else {

							this.errorMessage('error reading bytes via i2c',err);
							is_error = true;

						}

					}.bind(this));

				} else {

					this.errorMessage('error writing bytes via i2c',err);
					is_error = true;

				} 
					

			}.bind(this));

		} else {

			this.errorMessage('Command sent was same as END_OF_COMMAND',command);
			is_error = true;

		}

		if (is_error) {
			// Execute the callback if the script asked for it.
			callback && callback.call( this, is_error, 0 );
		}
		
	};

	this.echo = function(byte1,byte2,callback) {

		this.issueCommand(constants.CMD_ECHO,[byte1,byte2],false,function(err,res) {
			callback && callback.call( this, res, err);
		});

	};


	// --------------------------------------------------------------------------------------
	// -- DEBUG ROUTINES --> Used for testing logical flow without physical interaction.
	// ...Chances are you may never need these.

	this.debugIgnitionDetect = function(set,state,callback) {

		// In a set mode, set it. else, get it.
		if (set) {

			this.issueCommand(constants.CMD_DEBUG_SET_IGN_DETECT,state,true,function(err,res) {

				// Handle potential errors.			
				if (err) {
					this.errorMessage('Issue changing debug ignition detect state',err);
				}

				// Return in a callback.
				callback && callback.call( this, res, err);

			});

		} else {

			// so, we'll get it.
			this.issueCommand(constants.CMD_DEBUG_GET_IGN_DETECT,state,true,function(err,res) {

				// Handle potential errors.			
				if (err) {
					this.errorMessage('Issue getting debug ignition detect state',err);
				}

				// Return in a callback.
				callback && callback.call( this, res, err);

			});

		}

	};

	this.debugSetIgnitionManually = function(state,callback) {

		// console.log("setting state: ",state);

		set_state = 0;
		if (state) {
			set_state = 1;
		}

		this.issueCommand(constants.CMD_DEBUG_SET_IGN_STATE,[set_state,0],true,function(err,res) {
			callback && callback.call( this, err);
		});

	};

	this.debugGetTestValue = function(callback) {

		this.issueCommand(constants.CMD_DEBUG_GET_TEST_VALUE,0,true,function(err,res) {
			callback && callback.call( this, res, err);
		});

	};

	this.debugGetWatchDogState = function(callback) {

		this.issueCommand(constants.CMD_DEBUG_GET_WDT_STATE,0,true,function(err,res) {
			callback && callback.call( this, res, err);
		});

	};

	

	this.bar = function() {

		console.log("another command!");

	};


	// ---------------------------- end debug routines.

	this.errorMessage = function(message,item) {

		// Send a message to the console.
		console.log("ERROR: " + message,item);
		// Keep it so you can look it up if need be.
		this.last_error = message;

	}

	// ---------------------- Debug output.

	this.debug = function(item,message) {

		message = message || "";	// Give message a default if not passed.
	
		if (constants.DEBUG) {

			console.log(message,item);

		}

	};
	
};

// -------------- Reference code.

/*
// --- Very cool!
wire.scan(function(err, data) {
  // result contains an array of addresses
        console.log(data);
});
*/

/* callback example


function callbacks_with_call( arg1, arg2, callback ){
  console.log( 'do something here' );
 
  var result1 = arg1.replace( 'argument', 'result' ),
      result2 = arg2.replace( 'argument', 'result' );
 
  this.data = 'i am some data that can be use for the callback function with `this` key word';
 
  // if callback exist execute it
  callback && callback.call( this, result1, result2 );
}

*/