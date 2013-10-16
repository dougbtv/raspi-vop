// -----------------------------------------------------------------
// -- Logger: Just a handy function for syslog.
// -----------------------------------------------------------------

module.exports = function(Syslog) {

	Syslog.init("node-syslog", Syslog.LOG_PID | Syslog.LOG_ODELAY, Syslog.LOG_LOCAL5);
	// Syslog.close();

	this.log = function(message) {

		Syslog.log(Syslog.LOG_INFO, message); // + new Date());

	};


}