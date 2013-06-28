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

.factory('AbstractDirectory', [
    function () {

        var AbstractDirectory = function (parentDirectory, name) {
            this.isDirectory = true;
            this.isFile = false;

            this.parentDirectory = parentDirectory;
            this.name = name;

            this.workspaceId = null;

            this.collapsed = true;
            this.children = {};
        };

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        /* Stets the folder parent directory.*/
        AbstractDirectory.prototype.setParentDirectory = function (directory) {
            this.parentDirectory = directory;
        };

        /* Gets the folder full path.*/
        AbstractDirectory.prototype.getFullPath = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getFullPath() + '/' + this.name;
            } else {
                /* This is the root directory y (ie. parentDirecotry 
                 * is null), the folder name is ignored. */
                return '';
            }
        };

        /* Gets the folder basename.*/
        AbstractDirectory.prototype.getBasename = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getFullPath() + '/';
            } else {
                /* This is the root directory y (ie. parentDirecotry 
                 * is null). */
                return '/';
            }
        };

        /* Gets the folder workspace id.*/
        AbstractDirectory.prototype.getWorkspaceId = function () {
            if (this.parentDirectory !== null) {
                return this.parentDirectory.getWorkspaceId();
            } else {
                /* Only the root directory (ie. parentDirecotry is null) 
                 * contains the valid workspace id. */
                return this.workspaceId;
            }
        };

        AbstractDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        /* Make AbstractDirectory serializable. */
        AbstractDirectory.prototype.toJSON = function () {
            return {
                isDirectory: true,
                isFile: false,
                name: this.name,
                children: this.children,
                basename: this.getBasename(),
                workspaceId: this.getWorkspaceId()
            };
        };

        /* --------------------------
         *  Abstract Methods.
         * -------------------------- */

        AbstractDirectory.prototype.onReady = function (callback) {
            callback = callback; /* Keep jshint happy. */
            throw 'Abstract method "AbstractDirectory.onReady" is not implemented.';
        };

        /* Update the children list. */
        AbstractDirectory.prototype.updateChildren = function () {
            throw 'Abstract method "AbstractDirectory.updateChildren" is not implemented.';
        };

        /* Add an entry */
        AbstractDirectory.prototype.addEntry = function (entry) {
            entry = entry; /* Keep jshint happy. */
            throw 'Abstract method "AbstractDirectory.addEntry" is not implemented.';
        };

        return AbstractDirectory;
    }
]);
