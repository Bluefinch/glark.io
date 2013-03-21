/* This file is part of the PPEA project.
 * Copyright Florent Galland & Luc Verdier 2012. */

var express = require('express');
var http = require('http');
var path = require('path');
//var socketio = require('socket.io');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    // app.set('port', process.env.PORT || 80);
    //app.set('views', __dirname + '/app');
    //app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'app')));

    /* Here we define the last non-error middleware. Since nothing else
     * responded, we assume 404. */
    app.use(function (req, res, next) {
        res.status(404);
        
        // Respond with html page.
        if (req.accepts('html')) {
            //res.render('404', { url: req.url });
            return;
        }

        // Respond with json.
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // Default to plain text.
        res.type('txt').send('Not found');
    });

    /* Finally the error middleware. */
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        //res.render('500', { error: err });
    });
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

// Make the title of the app available everywhere.
app.set('title', 'PPEA');

// -----------------------------------
//  Route the requests.
// -----------------------------------

app.get('/', function (req, res, next) {
    res.sendFile('app/index.html');
});


// -----------------------------------
//  Set up the servers.
// -----------------------------------

var server = http.createServer(app);
//var io = socketio.listen(server);
// var io = socketio.listen(server, {log: false});
    
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

/*io.sockets.on('connection', function (socket) {
    console.log('Websocket connection.');
});*/

