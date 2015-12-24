var app, config, env, fs, models, mongoose, passport, port, redis, redisClient, redisgreen;

console.log = (global.process.env.NODE_ENV != null) && global.process.env.NODE_ENV === 'live' ? function() {} : console.log;

app = require('express')();

passport = require('passport');

config = require('./config/config');

fs = require('fs');

env = require('node-env-file');

redis = require('redis');

mongoose = require('mongoose');

mongoose.connect(config.dbURI + '?slaveOk=true&connectTimeoutMS=10000');

if (process.env.REDISGREEN_URL != null) {
  redisgreen = require("url").parse(process.env.REDISGREEN_URL);
  redisClient = redis.createClient(redisgreen.port, redisgreen.hostname);
  redisClient.auth(redisgreen.auth.split(":")[1]);
} else {
  redisClient = redis.createClient();
}

models = __dirname + '/models';

fs.readdirSync(models).forEach(function(file) {
  return require(models + '/' + file);
});

require('./config/passport')(passport, config);

require('./config/express')(app, passport, redisClient);

require('./config/routes')(app, passport, redisClient);

port = process.env.PORT || 3000;

app.listen(port, function() {
  return console.log("Server running on port " + port);
});
