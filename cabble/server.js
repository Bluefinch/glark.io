#!/usr/bin/node
/* Copyright 2013 Florent Galland & Luc Verdier

This file is part of glark.io.

glark.io is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
at your option) any later version.

glark.io is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with glark.io.  If not, see <http://www.gnu.org/licenses/>. */

var config = require('./config.js');
var express = require('express');
var http = require('http');
var path = require('path');
//var socketio = require('socket.io');

var app = express();

// Make the title of the app available everywhere.
app.set('title', 'glark.io');

// Listen to the port given in the env var if it exists or the one given in config.
app.set('port', process.env.PORT || config.server.listenPort);

// From now on, log everything.
app.use(express.logger('dev'));

// Serve static files.
app.use(express.compress());
app.use(express.favicon(path.join(config.server.distFolder, 'img/favicon.ico')));
app.use(express['static'](config.server.distFolder));

app.use(express.bodyParser());
app.use(express.methodOverride());

// TODO Build the 404 and error pages.
/* Here we define the last non-error middleware. Since nothing else
 * responded, we assume 404. */
// app.use(function (req, res, next) {
    // res.status(404);

    // // Respond with html page.
    // if (req.accepts('html')) {
        // //res.render('404', { url: req.url });
        // return;
    // }

    // // Respond with json.
    // if (req.accepts('json')) {
        // res.send({ error: 'Not found' });
        // return;
    // }

    // // Default to plain text.
    // res.type('txt').send('Not found');
// });

/* Finally the error middleware. */
// app.use(function (err, req, res, next) {
    // res.status(err.status || 500);
    // //res.render('500', { error: err });
// });

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// -----------------------------------
//  Route the requests.
// -----------------------------------

/* Route everything that was not answered yet to the main page. */
// FIXME disable this when implementing the invite collab feature.
app.all('*', function (req, res) {
    res.redirect('/');
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

