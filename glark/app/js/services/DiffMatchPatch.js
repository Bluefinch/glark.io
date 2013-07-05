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
            this._dmp = new diff_match_patch();
        };

        /* Return a patch text from the diff between the two given strings. */
        DiffMatchPatch.prototype.diffAndMakePatch = function (original, changed) {
            return this._dmp.patch_toText(this._dmp.patch_make(original, changed));
        };

        return DiffMatchPatch;
    }
]);
