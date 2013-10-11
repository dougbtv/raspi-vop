var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '*'
});

client.post('/hello/dude', { hello: 'world', foo: 'bar' }, function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

client.post('/hello/dude', { hello: 'chungo', foo: 'quux' }, function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});