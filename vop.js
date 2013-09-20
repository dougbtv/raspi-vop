

var constants = require("./constants.js");         // Constants module (w/ general configs)
var WireInterface = require("./wireInterface.js");      // Our module for interfacing on the wire with i2c.

// ------- Initialize the i2c module
// -- Docs @ https://github.com/kelly/node-i2c
var i2c = require('i2c');
var address = constants.I2C_ADDRESS;
var wire = new i2c(address, {device: constants.I2C_DEVICE}); // point to your i2c address, debug provides REPL interface

// Add an interface to our wire object.
wireInterface = new WireInterface(wire,constants);
wireInterface.foo(14,false,function(err,result){
        console.log("callback error",err);
        console.log("callback result",result);

});

wireInterface.bar();