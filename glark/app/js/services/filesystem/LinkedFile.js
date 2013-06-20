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

/* Create a glark.services.File object from a html5 File or Blob object. */
.factory('LinkedFile', ['$rootScope', '$q', 'socket',
    function ($rootScope, $q, socket) {

        /* Create a remote file from his name and
         * params, where params contains information
         * to connect the Rest API. */
        var LinkedFile = function (workspaceId, file) {
            this.isDirectory = false;
            this.isFile = true;

            this.name = file.name;
            this.workspaceId = workspaceId;
            this.basename = file.basename;
            this.changed = false;
        };

        /* Get the content of the remote file. */
        LinkedFile.prototype.getContent = function () {
            var defered = $q.defer();
            socket.broadcast('getFileContent', this, function (content) {
                if (content !== null) {
                    $rootScope.$apply(function () {
                        defered.resolve(content);
                    });
                }
            });
            return defered.promise;
        };

        /* Set the content of the remote file. */
        LinkedFile.prototype.setContent = function (content) {
            var defered = $q.defer();
            defered.resolve("response.data.content");
            return defered.promise;
        };

        /* Create file on remote. */
        LinkedFile.prototype.create = function (content) {
            var defered = $q.defer();
            defered.resolve("response.data.content");
            return defered.promise;
        };

        /* Make this serializable so that it can be send over the network. */
        LinkedFile.prototype.toJSON = function () {
            return {
                isDirectory: false,
                isFile: true,
                name: this.name,
                basename: this.basename,
                workspaceId: this.workspaceId
            };
        };

        return LinkedFile;
    }
]);
