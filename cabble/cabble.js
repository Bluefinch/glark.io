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

module.exports = {
    sessions: {},

    makeRandomHash: function () {
        return crypto.randomBytes(4).toString('hex');
    },

    /* Start a new session, return its associated hash. */
    startNewSession: function () {
        var hash = this.makeRandomHash();
        this.sessions[hash] = { creationTime: Date.now() };
        return hash;
    },

    isValidSessionHash: function (sessionHash) {
        if (typeof this.sessions[sessionHash] === 'undefined') {
            return false;
        } else {
            return true;
        }
    },

    registerUser: function (sessionHash, next) {
        if (typeof this.sessions[sessionHash] === 'undefined') {
            next(new Error('Unable to register user for unknown session hash ' + sessionHash));
        } else {
            console.log('toto');
            next();
        }
    }
};
