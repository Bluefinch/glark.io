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

    /* The socket service allows to send and receive events to and from _all_
     * the other socket connected to our room. */
    .factory('socket', ['$rootScope', '$location', function ($rootScope, $location) {

        var socket = {};

        /* Our connected socketio instance. */
        socket.socket = io.connect();

        /* Register with our session hash. */
        var splitted = $location.absUrl().split('/');
        socket.sessionHash = splitted[splitted.length - 1];
        socket.socket.emit('register', socket.sessionHash);

        socket.emit = function (eventName, data) {
            /* The 'proxy' event is used to proxy some data to all the other socket
             * connected to our room. */
            console.log({'eventName': eventName, 'data': JSON.stringify(data)});
            socket.socket.emit('proxy', {'eventName': eventName, 'data': JSON.stringify(data)});
        };

        socket.on = function (eventName, callback) {
            $rootScope.$on(eventName, function (event, data) {
                callback(data);
            });
        };

        /* The 'proxy' event is used to proxy some data to all the other socket
         * connected to our room. */
        socket.socket.on('proxy', function (data) {
            $rootScope.$broadcast(data.eventName, JSON.parse(data.data));
        });


        return socket;
    }]);

