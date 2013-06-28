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
.factory('RemoteFile', ['AbstractFile', 'base64', '$q', '$http',
    function (AbstractFile, base64, $q, $http) {

        /* Create a remote file from his name and
         * params, where params contains information
         * to connect the Rest API. */
        var RemoteFile = function (parentDirectory, name, params) {
            AbstractFile.call(this, parentDirectory, name);

            this.params = params;

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };

        /* RemoteFile extends AbstractFile. */
        RemoteFile.prototype = Object.create(AbstractFile.prototype);
        RemoteFile.prototype.constructor = RemoteFile;

        /* --------------------------
         *  Public Methods.
         * -------------------------- */

        RemoteFile.prototype.getFullUrl = function () {
            return 'http://' + this.params.hostname + ':' + this.params.port + '/connector/files' + this.getFullPath();
        };

        /* --------------------------
         *  Override Methods.
         * -------------------------- */

        /* Get the content of the remote file. */
        RemoteFile.prototype.getContent = function () {
            var defered = $q.defer();
            $http.get(this.getFullUrl(), {
                headers: {
                    'Authorization': this.authenticationHeader
                }
            })
                .success(function (response) {
                    defered.resolve(response.data.content);
                })
                .error(function (response, status) {
                    console.log('Error in $http get. Unable to get content of remote file.');
                    defered.reject(response, status);
                });
            return defered.promise;
        };

        /* Set the content of the remote file. */
        RemoteFile.prototype.setContent = function (content) {
            var defered = $q.defer();
            $http.put(this.getFullUrl(), {
                'content': content
            }, {
                headers: {
                    'Authorization': this.authenticationHeader
                }
            })
                .success(function (response) {
                    defered.resolve(response.data.content);
                })
                .error(function (response, status) {
                    console.log('Error in $http put. Unable to set content of remote file.');
                    defered.reject(response, status);
                });
            return defered.promise;
        };

        /* Create file on remote. */
        RemoteFile.prototype.create = function (content) {
            var defered = $q.defer();
            $http.post(this.getFullUrl(), {
                'content': content
            }, {
                headers: {
                    'Authorization': this.authenticationHeader
                }
            })
                .success(function (response) {
                    defered.resolve(response.data.content);
                })
                .error(function (response, status) {
                    console.log('Error in $http put. Unable to create remote file.');
                    defered.reject(response, status);
                });
            return defered.promise;
        };

        return RemoteFile;
    }
]);
