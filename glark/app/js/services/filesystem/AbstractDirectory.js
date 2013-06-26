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

        var AbstractDirectory = function (name) {
            this.isDirectory = true;
            this.isFile = false;

            this.name = name;
            this.basename = null;
            this.isRoot = false;

            this.workspaceId = null;

            this.collapsed = true;
            this.children = {};
        };

        /* --------------------------
         *  Private Methods.
         * -------------------------- */

        AbstractDirectory.prototype._updateChildBasename = function () {
            var basename = this.isRoot ? '/' : this.basename + this.name + '/';

            /* The folder should be ready before updateing
             * the children base name. */
            var _this = this;
            this.onReady(function () {
                angular.forEach(_this.children, function (child) {
                    child.setBasename(basename);
                });
            });
        };

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        /* Set the directory as root.*/
        AbstractDirectory.prototype.setAsRoot = function () {
            this.isRoot = true;
            this.name = null;
            this.basename = '/';
            this._updateChildBasename();
        };

        /* Set the directory name.*/
        AbstractDirectory.prototype.setName = function (name) {
            this.name = name;
            this._updateChildBasename();
        };

        /* Set the directory basename.*/
        AbstractDirectory.prototype.setBasename = function (basename) {
            this.basename = basename;
            this._updateChildBasename();
        };

        /* Set the directory workspace.*/
        AbstractDirectory.prototype.setWorkspaceId = function (workspaceId) {
            this.workspaceId = workspaceId;

            /* The folder should be ready before updateing
             * the children workspace id. */
            var _this = this;
            this.onReady(function () {
                angular.forEach(_this.children, function (child) {
                    child.setWorkspaceId(workspaceId);
                });
            });
        };

        AbstractDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        /* --------------------------
         *  Abstract Methods.
         * -------------------------- */

        AbstractDirectory.prototype.onReady = function (callback) {
            throw 'Abstract method "AbstractDirectory.onReady" is not implemented.';
        };

        /* Update the children list. */
        AbstractDirectory.prototype.updateChildren = function () {
            throw 'Abstract method "AbstractDirectory.updateChildren" is not implemented.';
        };

        /* Add an entry */
        AbstractDirectory.prototype.addEntry = function (entry) {
            throw 'Abstract method "AbstractDirectory.addEntry" is not implemented.';
        };

        return AbstractDirectory;
    }
]);
