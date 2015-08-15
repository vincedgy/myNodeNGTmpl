/**
 * Created by Training on 22/10/2014.
 */

module.exports = function(express,config, app) {
    var   config = require('./config')
        , router = express.Router()
        , path  = require('path');

    console.log('Configuring ROUTER...');

// route middleware that will happen on every request
    router.use(function (req, res, next) {
        // log each request to the console
        console.log(req.method, req.url);
        // continue doing what we were doing and go to the route
        next();
    });

    // HOME PAGE
    router.get('/', function (req, res) {
      return res.render(path.join(config.publicDir, 'index'));
    });

    // 404
    router.get('*', function(req, res, next) {
        var err = new Error();
        err.status = 404;
        next(err);
    });

    app.use('/', router);
};
