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


var restify = require('restify');

function respond(req, res, next) {
	/*
	console.log("the req",req);
	console.log("the res",res);
	console.log("the next",next);
	*/
	// res.send('hello ' + req.params.name);
	console.log('ze req!',req.params);
	res.contentType = 'json';
	res.send({message: "hello", guy: req.params.name});
}

var server = restify.createServer();
server.use(restify.bodyParser());

server.get('/hello/:name', respond);
server.post('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});

// ----------------------------------------------------
// -- Testing script.
// This comprises the unit tests for the i2c interface
// ----------------------------------------------------

// Uncomment this and create a test plan object.
// testPlan = new TestPlan(moment,wireInterface);

// -- With the watchdog off, initiate a shutdown, then cancel it.
// testPlan.watchDogOffCancelAShutdown();

// -- Request a shutdown in 2 minutes
// testPlan.watchDogOffRequestShutdown(true,2);

// -- Request a shut down in 15 seconds.
// testPlan.watchDogOffRequestShutdown(false,15);

// -- Test the i2c error rate by loading this with tons of tests as fast as you can.
// testPlan.errorBlaster(10000);

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
