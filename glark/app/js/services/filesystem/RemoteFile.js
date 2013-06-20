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
.factory('RemoteFile', ['base64', '$q', '$http',
    function (base64, $q, $http) {

        /* Create a remote file from his name and
         * params, where params contains information
         * to connect the Rest API. */
        var RemoteFile = function (name, params, basename) {
            this.isDirectory = false;
            this.isFile = true;

            this.name = name;
            this.basename = '/';
            this.changed = false;

            if (basename !== undefined) {
                this.basename = basename;
            }

            this.params = params;

            this.baseurl = 'http://' + params.hostname + ':' + params.port + '/connector';
            this.baseurl += this.basename + this.name;

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };

        /* Get the content of the remote file. */
        RemoteFile.prototype.getContent = function () {
            var defered = $q.defer();
            $http.get(this.baseurl, {
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
            $http.put(this.baseurl, {
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
            $http.post(this.baseurl, {
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
