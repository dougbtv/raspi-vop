var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '*'
});

// ------- Example client showing all of the functions.

client.get('/get-info', function(err, req, res, obj) {
  console.log('------------------------------- Getting info');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

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

client.post('/auto-pat', { seconds: 6 }, function(err, req, res, obj) {
  console.log('------------------------------- Setting auto-pat (at 6 seconds intervals)');
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

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