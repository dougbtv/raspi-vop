// Creates a "constants" object with defines
// To use like, well, defined constants, but... pack it up real nice.
// Idea: http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// ---------------------------------- Client options.
define('TURN_OFF_AFTER_SECONDS',1*60) 	// IMPORTANT: When the ignition is off for this many seconds, the raspberry pi will shutdown.
define('SHUTDOWN_COMMAND','/root/raspi-vop/shutdown.sh');			// IMPORTANT: The command we'll issue to shutdown. Defaults to an example bash script, which will shutdown the raspi.
define('AUTOPAT_INTERVAL',6);			// How often we autopat, in seconds.
define('GET_STATE_INTERVAL',5);			// How often we get the state of the ignition, in seconds.


// ---------------------------------- Debug constants.
define('DEBUG',false);

//----------------------------------- i2c Constants
define("I2C_ADDRESS",0x04);
define("I2C_DEVICE",'/dev/i2c-1');

// ---------------------------------- Wire API Constants

 define('END_OF_COMMAND',0x0A);
 define('NUMBER_RETURN_BYTES',4);

// ---------------------------------- Command definitions.

define('CMD_GET_IGNITION_STATE', 11);
define('CMD_GET_LAST_IGNITION_CHANGE_SECONDS', 12);
define('CMD_GET_LAST_IGNITION_CHANGE_MINUTES', 13);
define('CMD_ECHO', 14);
define('CMD_PAT_WATCHDOG', 15);
define('CMD_SET_WATCHDOG', 16);
define('CMD_GET_WATCHDOG', 17);
define('CMD_REQUEST_SHUTDOWN_SECONDS', 18);
define('CMD_REQUEST_SHUTDOWN_MINUTES', 19);
define('CMD_GET_SHUTDOWN_STATE', 20);
define('CMD_CANCEL_SHUTDOWN', 21);


define('CMD_DEBUG_SET_IGN_DETECT', 100);
define('CMD_DEBUG_SET_IGN_STATE', 101);
define('CMD_DEBUG_GET_IGN_DETECT', 102);
define('CMD_DEBUG_GET_TEST_VALUE', 103);
define('CMD_DEBUG_GET_WDT_STATE', 104);
