// Don't forget the i2c module docs @ https://github.com/kelly/node-i2c

module.exports = function(wire,constants) {

	// Here's the wire object, from the i2c module.
	
	
	// Now, let's create a method to write a command.
	this.foo = function() {

		// Firstly, we write the first three bytes of the command.
		// The first byte is the command itself.
		// The next are two parameter bytes.
		wire.writeBytes(0x0D, [0x02, 0x03], function(err) {

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
							command = buf.readUInt8(1);
							value = buf.readUInt16BE(2);

							this.debug(error,'error');
							this.debug(command,'command');
							this.debug(value,'value');

						} else {

							console.log('Unexpected buffer length',buf);

						}

					} else {

						console.log('error reading bytes via i2c',err);

					}

				}.bind(this));

			} else {

				console.log('error writing bytes via i2c',err);

			} 
				

		}.bind(this));
		
	};

	this.bar = function() {

		console.log("another command!");

	};

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
