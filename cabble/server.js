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
var socketio = require('socket.io');

var app = express();

// Make the title of the app available everywhere.
app.set('title', 'glark.io');

// Listen to the port given in the env var if it exists or the one given in config.
app.set('port', process.env.PORT || config.server.listenPort);

// From now on, log everything.
app.use(express.logger('dev'));

// Serve static files.
app.use(express.compress());

var staticFolder = '';
app.configure('development', function () {
    staticFolder = config.server.devFolder;
});

app.configure('production', function () {
    staticFolder = config.server.distFolder;
});

console.log('Using static folder: ' + staticFolder);

app.use(express.favicon(path.join(staticFolder, 'favicon.ico')));
app.use(express['static'](staticFolder));

app.use(express.bodyParser());
app.use(express.methodOverride());

// Error handler.
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
var io = socketio.listen(server);
// var io = socketio.listen(server, {log: false});
    
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    console.log('Websocket connection.');

    /* Use this event to proxy some data to all the sockets connected in your
     * room. */
    socket.on('proxy', function (data) {
        socket.broadcast.emit('proxy', data);
    });
});

