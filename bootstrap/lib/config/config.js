var config;

config = {
  live: {
    env: 'live',
    baseURI: 'http://mysite.com',
    bareURI: 'mysite.com'
  },
  staging: {
    env: 'staging',
    baseURI: 'http://mystagingsite.com',
    bareURI: 'mystagingsite.com'
  },
  development: {
    env: 'development',
    baseURI: 'http://localhost:3000',
    bareURI: 'localhost:3000',
    dbURI: 'mongodb://localhost/hdbootstrap'
  }
};

module.exports = global.process.env.NODE_ENV ? config[global.process.env.NODE_ENV] : config.development;
