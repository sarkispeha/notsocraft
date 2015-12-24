
# Routes

middleware = {

	authorize : (req, res, next) ->
		if not req.isAuthenticated()
			return res.redirect '/login'
		else
			next()

	setLocals : (req, res, next) ->
		#Always pass user object and environment variable to views
		res.locals.user = req.user
		res.locals.ENV = global.process.env.NODE_ENV
		next()
			
}

module.exports = (app, passport, redis) ->

	#Index
	index = require '../controllers/index'
	app.get '/', middleware.authorize, middleware.setLocals, index.index

	#auth
	auth = require '../controllers/auth'
	app.get '/login', auth.login
	app.post '/auth', passport.authenticate('local', failureRedirect: '/login'), auth.auth
	app.get '/logout', auth.logout
	
	#Accounts
	accounts = require '../controllers/accounts'
	app.post '/createaccount', accounts.createAccount

	


