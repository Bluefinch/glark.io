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

.factory('AbstractFile', [
    function () {

        var AbstractFile = function (name) {
            this.isDirectory = false;
            this.isFile = true;

            this.name = name;
            this.basename = null;
            this.changed = false;

            this.workspaceId = null;
        };

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        /* Set the file basename.*/
        AbstractFile.prototype.setBasename = function (basename) {
            this.basename = basename;
        };

        /* Set the file workspace id.*/
        AbstractFile.prototype.setWorkspaceId = function (workspaceId) {
            this.workspaceId = workspaceId;
        };

        /* Make AbstractFile serializable. */
        AbstractFile.prototype.toJSON = function () {
            return {
                isDirectory: false,
                isFile: true,
                name: this.name,
                basename: this.basename,
                workspaceId: this.workspaceId
            };
        };

        /* --------------------------
         *  Abstract Methods.
         * -------------------------- */

        AbstractFile.prototype.onReady = function (callback) {
            throw 'Abstract method "AbstractFile.onReady" is not implemented.';
        };

        /* Get the content of the maintened blob. */
        AbstractFile.prototype.getContent = function () {
            throw 'Abstract method "AbstractFile.getContent" is not implemented.';
        };

        /* Set the content of the maintened blob. */
        AbstractFile.prototype.setContent = function (content) {
            throw 'Abstract method "AbstractFile.setContent" is not implemented.';
        };

        return AbstractFile;
    }
]);
