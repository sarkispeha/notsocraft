var middleware;

middleware = {
  authorize: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    } else {
      return next();
    }
  },
  setLocals: function(req, res, next) {
    res.locals.user = req.user;
    res.locals.ENV = global.process.env.NODE_ENV;
    return next();
  }
};

module.exports = function(app, passport, redis) {
  var accounts, auth, index;
  index = require('../controllers/index');
  app.get('/', middleware.authorize, middleware.setLocals, index.index);
  auth = require('../controllers/auth');
  app.get('/login', auth.login);
  app.post('/auth', passport.authenticate('local', {
    failureRedirect: '/login'
  }), auth.auth);
  app.get('/logout', auth.logout);
  accounts = require('../controllers/accounts');
  return app.post('/createaccount', accounts.createAccount);
};
