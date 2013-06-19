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

    .factory('LinkedDirectory', ['LinkedFile', '$q',
            function (LinkedFile, $q) {

        var LinkedDirectory = function (workspaceId, basename) {
            this.isDirectory = true;
            this.isFile = false;

            this.workspaceId = workspaceId;
            this.basename = '/';

            if (basename !== undefined) {
                this.basename = basename;
            }

            this.collapsed = true;
            this.children = {};
        };

        LinkedDirectory.prototype.updateChildren = function () {
            /* Reset children list. */
            this.children = {};
        };

        /* @param entry is a services.filesystem.Local*
         * object. */
        LinkedDirectory.prototype.addEntry = function (entry) {
            
        };

        LinkedDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        return LinkedDirectory;
    }]);

