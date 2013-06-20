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

        /* Create an isolated scope. */
        socket.eventHandler = $rootScope.$new(true);

        socket.isReady = false;

        /* Register with our session hash. */
        var splitted = $location.absUrl().split('/');
        socket.sessionHash = splitted[splitted.length - 1];
        socket._socket.emit('register', socket.sessionHash, function (count) {
            console.log('Socket service registered for session ' + socket.sessionHash);
            console.log('Session count: ' + count);

            socket.isReady = true;
            /* Broadcast private event socket._ready. */
            socket.eventHandler.$broadcast('socket._ready');
        });

        socket._socket.on('proxy', function (data, callback) {
            /* If there is no data, do not broadcast it. There is always a
             * callback, it can be useless, but it is always there and valid. */
            if (data.data === 'null') {
                socket.eventHandler.$broadcast('socket.' + data.eventName, callback);
            } else {
                socket.eventHandler.$broadcast('socket.' + data.eventName, JSON.parse(data.data), callback);
            }
        });

        /* -----------------------------
         * Socket service public API.
         * ----------------------------- */
        
        socket.onReady = function (callback) {
            if (!this.isReady) {
                socket.eventHandler.$on('socket._ready', callback);
            } else {
                callback();
            }
        };

        /* Register to event coming from other sockets. */
        socket.on = function (eventName, callback) {
            socket.eventHandler.$on('socket.' + eventName, function (event, data, fn) {
                callback(data, fn);
            });
        };

        /* Broadcast event to all the other sockets connected to our room, passing
         * data and getting callbackcalled on completion. Both data and callback
         * are optionnal. */
        socket.broadcast = function (eventName, data, callback) {
            /* Handle optionnal parameters. */
            if (typeof data === 'function') {
                callback = data;
                data = null;
            }
            
            socket.onReady(function () {
                if (callback !== undefined) {
                    /* If broadcast with a callback, broadcast to each ids
                     * one by one, to handle multiple responses. */
                    socket._socket.emit('proxy.getIds', null, function (ids) {
                        angular.forEach(ids, function (id) {
                            socket._socket.emit('proxy.toSingle',
                                {'_socketId': id, 'eventName': eventName, 'data': JSON.stringify(data)},
                                callback);
                        });
                    });
                } else {
                    /* If broadcast without callback, broadcast directly to all. */
                     socket._socket.emit('proxy.toAll', {'eventName': eventName, 'data': JSON.stringify(data)});
                }
            });
        };
        
        /* Get the rom socket ids. */
        socket.isAlone = function (callback) {
            socket.onReady(function () {
                socket._socket.emit('proxy.getIds', null, function (ids) {
                    callback(ids.length === 0);
                });
            });
        };

        return socket;
    }]);
