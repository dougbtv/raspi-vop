

var constants = require("./constants.js");         // Constants module (w/ general configs)
var WireInterface = require("./wireInterface.js");      // Our module for interfacing on the wire with i2c.

// ------- Initialize the i2c module
// -- Docs @ https://github.com/kelly/node-i2c
var i2c = require('i2c');
var address = constants.I2C_ADDRESS;
var wire = new i2c(address, {device: constants.I2C_DEVICE}); // point to your i2c address, debug provides REPL interface

// Add an interface to our wire object.
wireInterface = new WireInterface(wire,constants);

function showInfo() {

        wireInterface.getIgnitionState(function(ign_state,err){
                console.log("--> The ignition state is",ign_state);

        });

        wireInterface.ignitionLastChanged(false,function(seconds,err){
                console.log("--> Ignition was changed n seconds ago:",seconds);
        });

        wireInterface.ignitionLastChanged(true,function(minutes,err){
                console.log("--> Ignition was changed n minutes ago:",minutes);
        });


        wireInterface.debugGetTestValue(function(testvalue,err){
                console.log("--> Test value:",testvalue);
        });

        wireInterface.debugGetWatchDogState(function(wdtstate,err){
                console.log("--> Watchdog State:",wdtstate);
        });

}


console.log("Starting....");

setTimeout((function() {
  showInfo();
}), 2000);

/*

wireInterface.echo(254,253,function(bytes,err){
        console.log("--> Echoed bytes:",bytes);
});


wireInterface.debugIgnitionDetect(true,false,function(res,err){
        console.log("--> Turned off ignition detection.");
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