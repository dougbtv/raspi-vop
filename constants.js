// Creates a "constants" object with defines
// To use like, well, defined constants, but... pack it up real nice.
// Idea: http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// ---------------------------------- Debug constants.
define('DEBUG',true);

//----------------------------------- i2c Constants
define("I2C_ADDRESS",0x04);
define("I2C_DEVICE",'/dev/i2c-1');

// ---------------------------------- Wire API Constants

 define('END_OF_COMMAND',0x0A);
 define('NUMBER_RETURN_BYTES',4);