// Don't forget the i2c module docs @ https://github.com/kelly/node-i2c

module.exports = function(wire) {

	// Here's the wire object, from the i2c module.
	this.wire = wire;
	
    // Now, let's create a method to "say" something to a channel.
    this.foo = function() {
    	
    	
		this.wire.writeBytes(0x0D, [0x02, 0x03], function(err) {

		        console.log("wrote bytes!");

		        this.wire.readBytes(0x0A,4,function(err, buf) {
		                console.log('Read from command.');
		                console.log(buf);

		                // For what we need, we can dig into the buffer like so.
		                // There's more fleshed out modules, but, we're talking a few bytes.
		                // http://nodejs.org/api/buffer.html
		                error = buf.readUInt8(0);
		                command = buf.readUInt8(1);
		                value = buf.readUInt16BE(2);

		                console.log('error',error);
		                console.log('command',command);
		                console.log('value',value);

		      	});

		}.bind(this));

    	
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
