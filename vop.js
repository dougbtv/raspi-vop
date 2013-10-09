var constants = require("./constants.js");             // Constants module (w/ general configs)
var WireInterface = require("./wireInterface.js");     // Our module for interfacing on the wire with i2c.
var TestPlan = require("./testPlan.js");               // This is our test plan, it's a suite of things we can test.

var moment = require('moment');                        // Moment.js module, mostly for debugging (so far).

// ------- Initialize the i2c module
// -- Docs @ https://github.com/kelly/node-i2c
var i2c = require('i2c');
var address = constants.I2C_ADDRESS;
var wire = new i2c(address, {device: constants.I2C_DEVICE}); // point to your i2c address, debug provides REPL interface

// Add an interface to our wire object.
wireInterface = new WireInterface(wire,constants);


// --------------------------------------------------
// ----- Testing script.
// --------------------------------------------------

testPlan = new TestPlan(moment,wireInterface);
testPlan.errorBlaster(10000);

// -- Test Method, boot fails, but ignition is on (expect reboot)
// testPlan.bootFailsIngitionON();

// -- Test method, boot fails, but ignition is off (expect shutdown, no reboot)
// testPlan.bootFailsIngitionOFF();

// -- A test for a nomal boot and shutdown!
// testPlan.normalBootAndShutdown();

// -- And another for a watchdog recovery during shutdown
// testPlan.watchdogRecoveryDuringShutdownPhase();

// -- And here's one for a shutdown with an early ignition back on after it's off (expect a reboot)
// testPlan.shutdownWithEarlyIgnition();
