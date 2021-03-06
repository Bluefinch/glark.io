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

        var AbstractFile = function (parentDirectory, name) {
            this.isDirectory = false;
            this.isFile = true;

            this.parentDirectory = parentDirectory;
            this.name = name;
            this.changed = false;

            /* The file edit session. */
            this.session = null;
        };

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        /* Set the file parent directory.*/
        AbstractFile.prototype.setParentDirectory = function (directory) {
            this.parentDirectory = directory;
        };

        AbstractFile.prototype.getParentDirectory = function () {
            return this.parentDirectory;
        };

        /* Get the file full path.*/
        AbstractFile.prototype.getFullPath = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getFullPath() + '/' + this.name;
            } else {
                return '';
            }
        };

        /* Get the file basename.*/
        AbstractFile.prototype.getBasename = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getFullPath() + '/';
            } else {
                return '';
            }
        };

        /* Get the file workspace id.*/
        AbstractFile.prototype.getWorkspaceId = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getWorkspaceId();
            } else {
                return null;
            }
        };

        /* Make AbstractFile serializable. */
        AbstractFile.prototype.toJSON = function () {
            return {
                isDirectory: false,
                isFile: true,
                name: this.name,
                basename: this.getBasename(),
                fullpath: this.getFullPath(),
                workspaceId: this.getWorkspaceId()
            };
        };

        /* --------------------------
         *  Abstract Methods.
         * -------------------------- */

        AbstractFile.prototype.onReady = function (callback) {
            callback = callback; /* Keep jshint happy. */
            throw 'Abstract method "AbstractFile.onReady" is not implemented.';
        };

        /* Get the content of the file, must return a promise. */
        AbstractFile.prototype.getContent = function () {
            throw 'Abstract method "AbstractFile.getContent" is not implemented.';
        };

        /* Set the content of the file, must return a promise. */
        AbstractFile.prototype.setContent = function (content) {
            content = content; /* Keep jshint happy. */
            throw 'Abstract method "AbstractFile.setContent" is not implemented.';
        };

        return AbstractFile;
    }
]);
