

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



/*

wireInterface.echo(254,253,function(bytes,err){
        console.log("--> Echoed bytes:",bytes);
});




wireInterface.ignitionLastChanged(false,function(seconds,err){
        console.log("--> Ignition was change n seconds ago",seconds);
});

wireInterface.getIgnitionState(function(ign_state,err){
        console.log("--> The ignition state is",ign_state);
});


// wireInterface.debugSetIgnitionManually(true,function(err){ console.log("--> Set ignition on."); });

// wireInterface.debugSetIgnitionManually(false,function(err){ console.log("--> Set ignition off."); });


wireInterface.getIgnitionState(function(ign_state,err){
        console.log("--> The ignition state is",ign_state);
});


wireInterface.ignitionLastChanged(false,function(seconds,err){
        console.log("--> Ignition was change n seconds ago",seconds);
});
*/

/*

------------------------------------------------------------------- TURN OFF IGNITION DETECTION
wireInterface.getIgnitionState(function(ign_state,err){
        console.log("The ignition state is",ign_state);
});

wireInterface.ignitionLastChanged(true,function(minutes,err){
        console.log("Ignition was change n minutes ago",minutes);
});

wireInterface.ignitionLastChanged(false,function(seconds,err){
        console.log("Ignition was change n seconds ago",seconds);
});

wireInterface.debugIgnitionDetect(false,false,function(state,err){
        console.log("BEFORE: What's the ignition detection state?",state);
});

wireInterface.debugIgnitionDetect(true,false,function(res,err){
        console.log("Turned off ignition detection.");
});

wireInterface.debugIgnitionDetect(false,false,function(state,err){
        console.log("AFTER: What's the ignition detection state?",state);
});
*/



/*
wireInterface.foo(14,[0xFF,0x01],false,function(err,result){
        console.log("callback error",err);
        console.log("callback result",result);

});

wireInterface.bar();
*/