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
'use strict';

angular.module('glark.services')

    /* The socket service allows to send and receive events to and from
     * the other sockets connected to our room. */
    .factory('socket', ['$rootScope', '$location', function ($rootScope, $location) {

        var socket = {};

        /* Our connected socket.io instance. */
        socket._socket = io.connect();

        /* Register with our session hash. */
        var splitted = $location.absUrl().split('/');
        socket.sessionHash = splitted[splitted.length - 1];
        socket._socket.emit('register', socket.sessionHash, function (isHost) {
            console.log('Socket service registered for session ' + socket.sessionHash);
            console.log('Is session host: ' + isHost);
            socket.isHost = isHost;
        });

        // ----------
        /* The 'proxy' event is used to proxy some data to all the other socket
         * connected to our room. */
        socket._socket.on('proxy', function (data) {
            $rootScope.$broadcast(data.eventName, JSON.parse(data.data));
        });

        socket._socket.on('toHost', function (data, callback) {
            /* If there is no data, do not broadcast it. There is always a
             * callback, it can be useless, but it is always there and valid. */
            if (data.data === 'null') {
                $rootScope.$broadcast(data.eventName, callback);
            } else {
                $rootScope.$broadcast(data.eventName, JSON.parse(data.data), callback);
            }
        });

        // ----------
        /* Socket service public API. */
        /* Broadcast event to all the other sockets connected to our room. */
        socket.broadcast = function (eventName, data) {
            /* The 'proxy' event is used to proxy some data to all the other socket
             * connected to our room. */
            // console.log({'eventName': eventName, 'data': JSON.stringify(data)});
            socket._socket.emit('proxy', {'eventName': eventName, 'data': JSON.stringify(data)});
        };

        /* Register to event coming from other sockets. */
        socket.on = function (eventName, callback) {
            $rootScope.$on(eventName, function (event, data, fn) {
                callback(data, fn);
            });
        };

        /* Directly emit to the room host, passing data and getting callback
         * called on completion. Both data and callback are optionnal. */
        socket.emitToHost = function (eventName, data, callback) {
            /* Handle optionnal parameters. */
            if (typeof data === 'function') {
                callback = data;
                data = null;
            } else if (typeof callback === 'undefined') {
                /* Declare a dummy callback. */
                callback = function () {}
            }

            socket._socket.emit('toHost',
                    {'eventName': eventName, 'data': JSON.stringify(data)},
                    callback);
        };

        return socket;
    }]);
