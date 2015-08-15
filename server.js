/*
 =========================================================================================================
 app.js
 for express 4
 =========================================================================================================
 */
(function() {
  'use strict';

  var express = require('express'),
    favicon = require('express-favicon'),
    compress = require('compression'),
    fileServer = require('serve-static'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    ejs = require('ejs'),
    config = require('./config'), // local module => config.js in current folder
    siteTitle;


  // EXPRESS 4 is loaded
  // =============================================================================
  console.log('Creating & configuring the server...');
  var app = express();

  // SETTINGS
  // =============================================================================
  // Default values if the config files is void !
  config.listenPort = config.listenPort || 8080;
  config.env = config.env || 'development';
  config.baseDir = config.baseDir || __dirname,
  config.viewsDir = config.viewsDir || path.join(config.baseDir, 'public');
  config.apiDir = config.apiDir || path.join(config.baseDir, 'api');

  console.log('Logger init');
  var accessLogStream = {};
  if ('development' == config.env) {
    console.log('\x1b[31m' + '=== Development environment ===' + '\x1b[37m');
    accessLogStream = require('fs').createWriteStream(__dirname + '/debug.log', {
      flags: 'a'
    });
    app.use(morgan('combined', {
      stream: accessLogStream
    }));

  } else {
    console.log('\x1b[32m' + '*** Live environment ***' + '\x1b[37m');
    accessLogStream = require('fs').createWriteStream(__dirname + '/logout.log', {
      flags: 'a'
    });
    app.use(morgan('tiny', {
      stream: accessLogStream
    }));
  }

  // Get name and version from package.json file
  siteTitle = config.siteTitle;
  app.set('title', siteTitle);
  app.set('config', config);
  app.locals.strftime = require('strftime');

  console.log('Favicon init');
  app.use(favicon(path.join(config.publicDir, 'favicon.ico')));


  // =============================================================================
  console.log('Views server init');
  app.use(compress()); // Use compress
  app.use(cors()); // enable ALL CORS requests

  // configure app to use bodyParser()
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // method-override => @see https://github.com/expressjs/method-override
  // this will let us get the data from a POST
  app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  app.set('views', config.publicDir);
  app.engine('ejs', ejs.renderFile);
  app.set('view engine', 'ejs');

  // STATIC
  // ==============================================================================
  console.log('Static content init');
  app.use(express.static(config.publicDir));

  // ROUTES
  // =============================================================================
  console.log('Router init');
  require('./routes')(express, config, app);

  // ===============================================================================
  // Handling Errors
  var errorhandler = require('errorhandler');
  app.use(errorhandler());

  /*
   ===============================================================
   Closing function
   ===============================================================
   */
  var cleanup = function() {
    console.log('\x1b[37;41m');
    console.log('### ========================================= ###');
    console.log('###                                           ###');
    console.log('###            STOPPING SERVER                ###');
    console.log('###                                           ###');
    console.log('### ========================================= ###');
    console.log('\x1b[37;40m');
    console.log('\x1b[0m');
    console.log('Killing process PID ' + process.pid);
    process.kill(process.pid);
    process.exit(0);
  };
  process.on('SIGQUIT', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGUSR2', cleanup);

  // HTTP Server
  // =============================================================================
  // Creating HTTP server from http module and launches the server
  app.listen(config.listenPort, function(err) {
    if (err) new Error('Impossible to launch the server listener');
    console.log('Web server listening on TCP port : ' + config.listenPort);
    console.log('\x1b[34;42m' + '>>>> Server ' + siteTitle + ' is ready <<<<', '\x1b[37;40m');
  });

})();
