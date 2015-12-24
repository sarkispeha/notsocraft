var RedisStore, bodyParser, cookieParser, express, multipart, session, xFrameOptions;

express = require('express');

session = require('express-session');

bodyParser = require('body-parser');

cookieParser = require('cookie-parser');

RedisStore = require('connect-redis')(session);

multipart = require('connect-multiparty');

xFrameOptions = require('x-frame-options');

module.exports = function(app, passport, redis) {
  var sessionConfig;
  app.set('views', __dirname + '/../../views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use('/public', express["static"](__dirname + '/../../public', {
    maxAge: 86400000
  }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
  }));
  app.use(bodyParser.json({
    limit: '50mb'
  }));
  app.use(multipart());
  sessionConfig = {
    secret: "B3IngHumaN!100",
    maxAge: new Date(Date.now() + 7200000),
    store: new RedisStore({
      client: redis,
      ttl: 7200
    }),
    saveUninitialized: true,
    resave: true
  };
  app.use(xFrameOptions());
  app.use(session(sessionConfig));
  app.use(function(req, res, next) {
    if (!req.session) {
      return next(new Error('Session Error:'));
    }
    return next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  return app.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  };
};
