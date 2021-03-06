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
/* jshint node: true */
'use strict';

var cabble = require('./cabble.js');
var config = require('./config.js');
var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

var app = express();

/* Make the title of the app available everywhere. */
app.set('title', 'glark.io');

/* Listen to the port given in the env var if it exists or the one given in config. */
app.set('port', process.env.PORT || config.server.listenPort);

/* Serve static files. */
app.use(express.compress());

app.configure('development', function () {
    app.set('staticFolder', config.server.devFolder);
});

app.configure('production', function () {
    app.set('staticFolder', config.server.distFolder);
});

console.log('Using static folder: ' + app.get('staticFolder'));

app.use(express.favicon(path.join(app.get('staticFolder'), 'favicon.ico')));

/* Mount the static folder at the /public url. */
app.use('/public', express.static(app.get('staticFolder')));

/* From now on, log everything. */
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());

/* Error handler. */
app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// -----------------------------------
//  Route the requests.
// -----------------------------------

app.get('/monitor', function (req, res) {
    /* Route used to monitor the app state. */
    res.send(cabble);
});

app.get('/:hash', function (req, res, next) {
    console.log('Request with hash: ' + req.params.hash);

    if (cabble.isValidSessionHash(req.params.hash)) {
        res.sendfile(path.join(app.get('staticFolder'), 'index.html'));
    } else {
        next(new Error('Invalid session hash ' + req.params.hash));
    }
});

app.get('/', function (req, res) {
    /* User is hitting root url, this is a new connection hence redirect
     * him toward a new hash. */
    console.log('Request with no hash.');
    var sessionHash = cabble.startNewSession();

    console.log('Session created: ' + sessionHash);

    res.redirect('/' + sessionHash);
});

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
io.set('log level', 0);
io.set('transports', ['xhr-polling']);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    console.log('Websocket connection.');

    var cabbleSession = null;
    socket.on('register', function (sessionHash, callback) {
        cabbleSession = cabble.registerToSession(sessionHash, socket);
        callback(cabbleSession.getSocketIds().length);
    });

    /* Use this event to retreive all the socket ids connected in your
     * room. */
    socket.on('proxy.getIds', function (data, callback) {
        var socketIds = [];
        var allSocketIds = cabbleSession.getSocketIds();
        allSocketIds.forEach(function (id) {
            if (id !== socket.id) {
                socketIds.push(id);
            }
        });
        callback(socketIds);
    });

    /* Use this event to proxy some data to all the sockets connected in your
     * room. */
    socket.on('proxy.toAll', function (data) {
        var socketIds = cabbleSession.getSocketIds();
        socketIds.forEach(function (id) {
            if (id !== socket.id) {
                cabbleSession.sockets[id].emit('proxy', data);
            }
        });
    });

    /* Use this event to proxy some data and callback a single socket of your room. */
    socket.on('proxy.toSingle', function (data, callback) {
        var socket = cabbleSession.sockets[data._socketId];
        if (socket !== undefined) {
            /* Remove _socketId field. */
            data._socketId = undefined;
            socket.emit('proxy', data, function (clientData) {
                callback(clientData);
            });
        } else {
            console.log('Error: Trying to proxy to a non-existing socket ' + socket.id);
            console.dir(cabbleSession);
        }
    });

    socket.on('disconnect', function () {
        console.log('Websocket ' + socket.id + ' disconnect.');
        var socketIds = cabbleSession.getSocketIds();
        socketIds.forEach(function (id) {
            if (id !== socket.id) {
                cabbleSession.sockets[id].emit('notifyDisconnection', socket.id);
            }
        });

        cabble.unregisterFromSession(cabbleSession, socket);
    });
});
