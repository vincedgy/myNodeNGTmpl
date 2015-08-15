/*
Objet de configuration portant les attributs
 */

var path = require('path')
  , baseDir = __dirname
  , config;

config = {
  env: 'development', //live, development
  listenPort: 3000,
  socket_timeout: 12000,                                // milli-seconds: default is 2 minutes
  basedir: baseDir,
  controllersDir: path.join(baseDir, 'controllers'),
  apiDir: path.join(baseDir, 'api'),
  publicDir: path.join(baseDir, 'public'),
  imgDir: path.join(baseDir, 'public/img'),
  siteTitle : "app"
};

// On export pour pouvoir faire le require
module.exports = config;
