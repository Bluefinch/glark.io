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

.factory('RemoteDirectory', ['AbstractDirectory', 'RemoteFile', 'base64', '$q', '$http',
    function (AbstractDirectory, RemoteFile, base64, $q, $http) {

        var RemoteDirectory = function (parentDirectory, name, params) {
            AbstractDirectory.call(this, parentDirectory, name);

            this.params = params;

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };

        /* RemoteDirectory extends AbstractDirectory. */
        RemoteDirectory.prototype = Object.create(AbstractDirectory.prototype);
        RemoteDirectory.prototype.constructor = RemoteDirectory;

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        RemoteDirectory.prototype.getFullUrl = function () {
            return 'http://' + this.params.hostname + ':' + this.params.port + '/connector/files' + this.getFullPath();
        };

        /* --------------------------
         *  Override Methods.
         * -------------------------- */

        RemoteDirectory.prototype.onReady = function (callback) {
            callback();
        };

        RemoteDirectory.prototype.updateChildren = function () {
            /* Reset children list. */
            this.children = {};

            /* Then update it. */
            var _this = this;
            $http.get(this.getFullUrl(), {
                headers: {
                    'Authorization': this.authenticationHeader
                }
            })
                .success(function (response) {
                    angular.forEach(response.data, function (entry) {
                        if (entry.type === 'file') {
                            var file = new RemoteFile(_this, entry.name, _this.params);
                            _this.children[entry.name] = file;
                        } else if (entry.type === 'dir') {
                            var directory = new RemoteDirectory(_this, entry.name, _this.params);
                            _this.children[entry.name] = directory;
                        }
                    });
                })
                .error(function ( /* response, status */ ) {
                    console.log('Error in $http get. Unable to update children of remote directory.');
                });
        };

        RemoteDirectory.prototype.addEntry = function (entry) {
            if (entry.isFile) {
                var _this = this;
                entry.getContent().then(function (content) {
                    var file = new RemoteFile(_this, entry.name, _this.params);
                    file.create(content).then(function () {
                        _this.children[file.name] = file;
                    });
                });
            }
        };

        return RemoteDirectory;
    }
]);
