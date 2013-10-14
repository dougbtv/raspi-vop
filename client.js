var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '*'
});

client.get('/get-info', function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

client.get('/pat', function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
})

client.post('/auto-pat', { seconds: 6 }, function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

/*
client.post('/yo/fudge', { hello: 'chungo', foo: 'quux' }, function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});
*/