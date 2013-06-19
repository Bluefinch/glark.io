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

    .factory('LinkedDirectory', ['$rootScope', 'LinkedFile', '$q', 'socket',
            function ($rootScope, LinkedFile, $q, socket) {

        /* Read the directoryEntry and create a list of
         * services.filesystem.*Local objects. */
        var createEntries = function (workspaceId, entries) {
            var children = {};
            angular.forEach(entries, function (entry) {
                if (entry.isFile) {
                    var file = new LinkedFile(workspaceId, entry);
                    children[entry.name] = file;
                } else if (entry.isDirectory) {
                    var directory = new LinkedDirectory(workspaceId, entry);
                    children[entry.name] = directory;
                }
            });
            return children;
        };
        
        var LinkedDirectory = function (workspaceId, directory) {
            this.isDirectory = true;
            this.isFile = false;

            this.name = directory.name;
            this.workspaceId = workspaceId;
            this.basename = directory.basename;

            this.collapsed = true;
            this.children = createEntries(workspaceId, directory.children);
        };

        LinkedDirectory.prototype.updateChildren = function () {
            /* The LinkedDirectory is maintened up to date. */
            var defered = $q.defer();
            defered.resolve();
            return defered.promise;
        };

        /* @param entry is a services.filesystem.Local*
         * object. */
        LinkedDirectory.prototype.addEntry = function (entry) {
            // TODO
        };

        LinkedDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        return LinkedDirectory;
    }]);

