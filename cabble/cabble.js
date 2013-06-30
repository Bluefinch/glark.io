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

var crypto = require('crypto');

var Session = function (hash) {
    this.hash = hash;
    this.creationTime = Date.now();

    this.sockets = {};
    this.socketCount = 0;
};

Session.prototype.toJSON = function () {
    return {
        hash: this.hash,
        creationTime: this.creationTime,
        socketCount: this.socketCount
    };
};

Session.prototype.getSocketIds = function () {
    return Object.keys(this.sockets);
};

Session.prototype.isEmpty = function () {
    return this.socketCount === 0;
};

Session.prototype._addSocket = function (socket) {
    this.sockets[socket.id] = socket;
    ++this.socketCount;
};

Session.prototype._removeSocket = function (socket) {
    if (socket.id in this.sockets) {
        delete this.sockets[socket.id];
        --this.socketCount;
    } else {
        console.log('Error: Trying to remove a non-existing socket ' + socket.id);
        console.dir(this);
    }
};

module.exports = {
    sessions: {},
    sessionCount: 0,

    makeRandomHash: function () {
        return crypto.randomBytes(4).toString('hex');
    },

    /* Start a new session, return its associated hash. */
    startNewSession: function () {
        var hash = this.makeRandomHash();
        this.sessions[hash] = new Session(hash);
        ++this.sessionCount;
        return hash;
    },

    endSession: function (session) {
        delete this.sessions[session.hash];
        --this.sessionCount;
    },

    /* Check if the given session hash is valid. */
    isValidSessionHash: function (sessionHash) {
        return this.sessions.hasOwnProperty(sessionHash);
    },

    registerToSession: function (sessionHash, socket) {
        console.log('Registering socket for session ' + sessionHash);
        console.log('Socket id ' + socket.id);
        if (this.isValidSessionHash(sessionHash)) {
            var session = this.sessions[sessionHash];
            session._addSocket(socket);
            return session;
        } else {
            console.log('Invalid session hash ' + sessionHash);
            console.log('Closing socket connection.');
            socket.disconnect();
            return null;
        }
    },

    unregisterFromSession: function (session, socket) {
        if (this.isValidSessionHash(session.hash)) {
            this.sessions[session.hash]._removeSocket(socket);

            /* If there is no more user connected to this session, delete it. */
            if (session.isEmpty()) {
                this.endSession(session);
            }
        } else {
            console.log('Error: Unable to unregister from session with invalid hash ' + session.hash);
        }
    }

};
