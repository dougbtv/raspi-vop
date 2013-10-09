// --------------------------------------------------------------------
// -- testPlan : A suite of actions to test the reliability of the vOP
// --------------------------------------------------------------------
// Mostly these methods coincide with the events as described in the
// timing diagram, which is available in the docs folder.

module.exports = function(moment,wireInterface) {


	sprintf = require('sprintf');

	// The instant where this begins.
	zerosecond = moment().unix();
	// console.log('zero second:',zerosecond);

	console.log("Test plan has begun....");

	// --------------------------------------------------------------------------------------------------
	// -- normalBootAndShutdown : Exactly that, a normal boot, normal operation, and normal shutdown.
	

	this.normalBootAndShutdown = function() {

		// Show the starting info.
		this.showInfo();
		// Enter debug mode (turn off ignition detect, as we'll set it manually).
		this.enterDebugMode();

		// 1 second later, turn the ignition on.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 1000);

		// At 10, 20 and 30 seconds, we send a pat.
		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 10000);

		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 20000);

		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 30000);


		// And at 25 seconds, we set ignition off.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(false,function(err){ 
		                console.log("--> Set ignition off.");
		        });
		        this.showInfo();
		}).bind(this), 25000);

		// And we're done.
		// It should not reboot after, as the ignition is off.

	};

	// --------------------------------------------------------------------------
	// -- shutdownWithEarlyIgnition : Shutdown where the ignition comes up before
	// we've powered down the raspberry pi.

	this.shutdownWithEarlyIgnition = function() {

		// Show the starting info.
		this.showInfo();
		// Enter debug mode (turn off ignition detect, as we'll set it manually).
		this.enterDebugMode();

		// 1 second later, turn the ignition on.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 1000);

		// At 10, 20 and 30 seconds, we send a pat.
		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 10000);

		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 20000);

		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 30000);


		// And at 25 seconds, we set ignition off.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(false,function(err){ 
		                console.log("--> Set ignition off.");
		        });
		        this.showInfo();
		}).bind(this), 25000);

		// But, then at 40 seconds, we set the ignition back on.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 40000);

		// We should see a reboot after this.

	};

	// --------------------------------------------------------------------------
	// -- watchdogRecoveryDuringShutdownPhase : Shutdown where the watchdog
	// recovers when we thought it had failed (comes up in shutdown interval)
	
	
	this.watchdogRecoveryDuringShutdownPhase = function() {

		// Show the starting info.
		this.showInfo();
		// Enter debug mode (turn off ignition detect, as we'll set it manually).
		this.enterDebugMode();

		// 1 second later, turn the ignition on.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 1000);

		// At 10, 20 we send a pat.
		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 10000);

		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 20000);


		// And at 25 seconds, we set ignition off.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(false,function(err){ 
		                console.log("--> Set ignition off.");
		        });
		        this.showInfo();
		}).bind(this), 25000);

		// And at 40 seconds (15 seconds later) we recover with a pat.
		setTimeout((function() {
			this.sendAPat();
		}).bind(this), 40000);

		// And finally, we should shutdown another minute + pat time from there.

		// And we're done.
		// It should not reboot after, as the ignition is off.

	};


	// --------------------------------------------------------------------------
	// -- bootFailsIngitionON : Emulates failure to boot while the ignition is on.
	

	this.bootFailsIngitionON = function() {

		// Show the starting info.
		this.showInfo();
		// Enter debug mode (turn off ignition detect, as we'll set it manually).
		this.enterDebugMode();


		// 2 seconds later, turn the ignition on, and we're done.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 2000);


		// It should reboot after this, as the ignition is on.

	};

	// --------------------------------------------------------------------------
	// -- bootFailsIngitionOFF : Emulates failure to boot while the ignition is on.

	this.bootFailsIngitionOFF = function() {

		// Show the starting info.
		this.showInfo();
		// Enter debug mode (turn off ignition detect, as we'll set it manually).
		this.enterDebugMode();


		// 2 seconds later, turn the ignition on.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(true,function(err){ 
		                console.log("--> Set ignition on.");
		        });
		        this.showInfo();
		}).bind(this), 2000);

		// And another 10 seconds after that, we set it off.
		setTimeout((function() {
		        this.timeLine();
		        wireInterface.debugSetIgnitionManually(false,function(err){ 
		                console.log("--> Set ignition off.");
		        });
		        this.showInfo();
		}).bind(this), 12000);

		// And we're done.
		// It should not reboot after, as the ignition is off.


	};

	
	// ------------------------------------------- Over arching functions, used in the test plans.

	this.sendAPat = function() {

		this.timeLine();
		wireInterface.patTheDog(function(err){
			console.log("--> I pet the dog.");
		});

		this.showInfo();
		

	};

	this.enterDebugMode = function() {

	        this.timeLine();

	        wireInterface.debugIgnitionDetect(true,false,function(res,err){
	                console.log("--> Turned off ignition detection.");
	        });


	};

	this.errorBlaster = function(number_cycles) {

		console.log("Processing " + number_cycles + " runs looking for errors.");

		errors = 0;
		for (i=0; i<number_cycles; i++) {

			wireInterface.echo(254,253,function(bytes,err){
				if (err) {
					errors++;
				}
			});

		}

		percent = (errors / number_cycles) * 100;
		percent = sprintf("%.02f",percent);
		console.log("Errors on " + errors + " of " + number_cycles + " cycles. (" + percent + "%)");


	}

	this.showInfo = function() {

	        this.timeLine();


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

	this.timeLine = function() {

	        console.log("----------------------------- Timeline:",(moment().unix()-zerosecond));

	};

}


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