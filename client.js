// --------------------------------------------------------
//              _____ _____    _____ _ _         _   
//  _ _ ___ ___|     |  _  |  |     | |_|___ ___| |_ 
// | | | -_| -_|  |  |   __|  |   --| | | -_|   |  _|
//  \_/|___|___|_____|__|     |_____|_|_|___|_|_|_|  
//
// --------------------------------------------------------
// The veeOP Client: Used to control the veeOP over a
// locally-hosted REST API.
// --------------------------------------------------------                                                

// Include our logger.
var Syslog = require('node-syslog');				// Node-syslog module.
var Logger = require('./library/logger.js');		// Our logging module.
var logger = new Logger(Syslog);					// Perform our syslog initialization / create our logger object.
var moment = require('moment');                     // Moment.js module, for time functions.


// Use our constants.
var constants = require("./library/constants.js");	// Constants module (w/ general configs)

// We'll want to execute a bash script at the end.
var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
    	callback(stdout); 
    });
};

// Go and use restify.
var restify = require('restify');

// And make ourselves a client.
var client = restify.createJsonClient({
	url: 'http://localhost:8080',
	version: '*'
});

logger.log("veeOP Client started.");

// ------- First things first, let's start up that auto-pat.

function setupAutoPat() {

	client.post('/auto-pat', { seconds: constants.AUTOPAT_INTERVAL }, function(err, req, res, json_response) {

		// Enable watchdog, just in case.
		client.get('/enable-watchdog', function(err, req, res, obj) {});

		if (json_response.error || err) {
			// Not good, let's recover by calling this function recursively on a failure.
			logger.log("Client: Setting up auto-pat failed. Retrying.");
			setupAutoPat();
		}

	});

}

// And execute that!
setupAutoPat();

// ------- Now we get into the meat of it, we wanna repeatedly get 
// 2 second later, turn the ignition off.

var ignition_off_detected = false;
var ignition_off_at = 0;

function detectIgnition() {

	setTimeout((function() {
	
		// Ok, so, let's figure out if the ignition is off.			
		client.get('/get-info', function(err, req, res, veeop_info) {
			// console.log('------------------------------- Getting info');
			// console.log('%d -> %j', res.statusCode, res.headers);
			// console.log('%j', veeop_info);
			run_again = true;

			// Here's it state.
			if (!veeop_info.ignition.state) {
				// Ok, the ignition is off. First did we know about this?
				if (!ignition_off_detected) {
					// So now we do.
					ignition_off_detected = true;
					// Ok, we didn't know about it.
					ignition_off_at = moment().unix();
				} else {
					// So, we knew the ignition is off.
					// How long has that been?
					off_time = moment().unix() - ignition_off_at;
					// console.log("the ignition has been off for:",off_time);
					if (off_time >= constants.TURN_OFF_AFTER_SECONDS) {
						// Ok! That means it's time to shutdown.
						// Don't run again.
						run_again = false;
						// Let's log that we're about to do that.
						logger.log("Executing shutdown script.");
						// Now, go ahead and let's execute our shutdown shell script.
						execute(constants.SHUTDOWN_COMMAND,function(stdout){});
						// That's all folks!
					}
				}
			} else {
				// Ignition is on, clear out any other data.
				ignition_off_detected = false;
			}

			// Run again, as long we're not shutting down.
			if (run_again) {
				detectIgnition();
			}

		});

	}).bind(this), constants.GET_STATE_INTERVAL * 1000); // Run every number of seconds as set in configuration.

}


// Start the ignition detection process.
detectIgnition();


/*
client.get('/enable-watchdog', function(err, req, res, obj) {
  console.log('------------------------------- Re-enabling watchdog....');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});


client.get('/pat', function(err, req, res, obj) {
  console.log('------------------------------- Issuing manual pat');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
})


client.get('/end-auto-pat', function(err, req, res, obj) {
  console.log('------------------------------- Immediately ending auto-pat');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});


client.get('/disable-watchdog', function(err, req, res, obj) {
  console.log('------------------------------- Disabling watchdog....');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});
*/

/*

--------------- Example shutdown.

setTimeout((function() {

	client.post('/shutdown', { unit: "seconds", value: 30}, function(err, req, res, obj) {
	  console.log('------------------------------- Sending shutdown for 30 seconds');
	  console.log('%d -> %j', res.statusCode, res.headers);
	  console.log('%j', obj);
	});

}).bind(this), 10000);

setTimeout((function() {

	client.get('/get-info', function(err, req, res, obj) {
	  console.log('------------------------------- Getting info');
	  console.log('%d -> %j', res.statusCode, res.headers);
	  console.log('%j', obj);
	});

}).bind(this), 11000);

*/