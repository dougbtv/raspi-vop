// -----------------------------------------------------------------
// -- Wire Interface : Performs the i2c handling over the wire.
// -----------------------------------------------------------------

// Don't forget the i2c module docs @ https://github.com/kelly/node-i2c

// Here it takes the wire object, from the i2c module, and constants module.

module.exports = function(wire,constants) {

	this.last_error = '';
	
	// Now, let's create a method to write a command.
	this.foo = function(command,is_int,callback) {

		// Here's our error flag;
		is_error = false;

		// Firstly, we write the first three bytes of the command.
		// The first byte is the command itself.
		// The next are two parameter bytes.
		// Note, it will take a number from 0-255 and pack it as a byte automatically.
		wire.writeBytes(0x0E, [0x02, 0x03], function(err) {

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
							value = buf.readUInt16BE(2);

							this.debug(error,'error');
							this.debug(readback_command,'readback_command');
							this.debug(value,'value');

							// We check that we got back the command we sent (it's kind of our error checking byte.)
							if (readback_command == command) {


								// Execute the callback if the script asked for it.
								callback && callback.call( this, error, value );

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
		
	};

	this.bar = function() {

		console.log("another command!");

	};

	this.errorMessage = function(message,item) {

		console.log("ERROR: " + message,item);

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