# Override console.log in production
console.log = if global.process.env.NODE_ENV? and global.process.env.NODE_ENV is 'live' then () -> else console.log

app = require('express')()
passport = require 'passport'
config = require './config/config'
fs = require 'fs'
env = require 'node-env-file'
redis = require 'redis'

# Connect to the DB
mongoose = require 'mongoose'
mongoose.connect(config.dbURI+'?slaveOk=true&connectTimeoutMS=10000')

# Connect to Redis
if process.env.REDISGREEN_URL?
	redisgreen = require("url").parse(process.env.REDISGREEN_URL)
	redisClient = redis.createClient(redisgreen.port, redisgreen.hostname)
	redisClient.auth(redisgreen.auth.split(":")[1])
else
	redisClient = redis.createClient()

# Models
models = __dirname + '/models'
fs.readdirSync(models).forEach (file) ->
	require(models + '/' + file)

# Passport Config
require('./config/passport')(passport, config)

# Express Config
require('./config/express')(app, passport, redisClient)

# Routes
require('./config/routes')(app, passport, redisClient)

port = process.env.PORT or 3000
app.listen port, () -> 
  console.log "Server running on port " + port

