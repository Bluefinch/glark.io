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

.factory('LinkedDirectory', ['AbstractDirectory', '$rootScope', 'LinkedFile', '$q',
    function (AbstractDirectory, $rootScope, LinkedFile, $q) {

        var LinkedDirectory = function (parentDirectory, linkedWorkspaceId, directory) {
            AbstractDirectory.call(this, parentDirectory, directory.name);

            this.linkedWorkspaceId = linkedWorkspaceId;

            var _this = this;
            angular.forEach(directory.children, function (child) {
                _this.addLinkedEntry(linkedWorkspaceId, child);
            });
        };

        /* LinkedDirectory extends AbstractDirectory. */
        LinkedDirectory.prototype = Object.create(AbstractDirectory.prototype);
        LinkedDirectory.prototype.constructor = LinkedDirectory;

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        LinkedDirectory.prototype.addLinkedEntry = function (linkedWorkspaceId, entry) {
            if (entry.isFile) {
                var file = new LinkedFile(this, linkedWorkspaceId, entry);
                this.children[entry.name] = file;
            } else if (entry.isDirectory) {
                var directory = new LinkedDirectory(this, linkedWorkspaceId, entry);
                this.children[entry.name] = directory;
            }
        };

        /* --------------------------
         *  Override Methods.
         * -------------------------- */

        LinkedDirectory.prototype.onReady = function (callback) {
            callback();
        };

        LinkedDirectory.prototype.updateChildren = function () {
            /* The LinkedDirectory is maintened up to date. */
            var defered = $q.defer();
            defered.resolve();
            return defered.promise;
        };

        LinkedDirectory.prototype.addEntry = function (entry) {
            entry = entry; /* Keep jshint happy. */
            throw 'Abstract method "AbstractDirectory.addEntry" is not implemented.';
        };

        return LinkedDirectory;
    }
]);
