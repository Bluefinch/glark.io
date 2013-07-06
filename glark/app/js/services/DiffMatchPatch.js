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
/* jshint camelcase: false */
'use strict';

angular.module('glark.services')

.factory('DiffMatchPatch', [
    function () {
        var DiffMatchPatch = function () {
            this._worker = new Worker('public/js/services/diffMatchPatchWorker.js');

            this._worker.onerror = function () {
                console.log('Error: unable to diff.');
            };

        };

        /* Gives a patch text from the diff between the two given strings to
         * the callback. */
        DiffMatchPatch.prototype.diffAndMakePatch = function (original, modified, callback) {
            this._worker.onmessage = function (e) {
                callback(e.data);
            };

            this._worker.postMessage({
                original: original,
                modified: modified
            });
        };

        return DiffMatchPatch;
    }
]);
