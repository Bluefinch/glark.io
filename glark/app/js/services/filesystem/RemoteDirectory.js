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

    .factory('RemoteDirectory', ['RemoteFile', 'base64', '$q', '$http',
            function (RemoteFile, base64, $q, $http) {

        var RemoteDirectory = function (name, params, basename) {
            this.isDirectory = true;
            this.isFile = false;

            this.name = name;
            this.basename = '/';

            if (basename !== undefined) {
                this.basename = basename;
            }

            this.collapsed = true;
            this.children = {};

            this.params = params;

            this.hostname = params.hostname;
            this.port = params.port;

            this.baseurl =  'http://' + params.hostname + ':' + params.port + '/connector';
            this.baseurl += this.basename + this.name;

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };

        RemoteDirectory.prototype.updateChildren = function () {
            /* Reset children list. */
            this.children = {};

            /* Then update it. */
            var _this = this;
            $http.get(this.baseurl, {headers: {'Authorization': this.authenticationHeader}})
                .success(function (response) {
                    angular.forEach(response.data, function (entry) {
                        var basename = _this.basename + _this.name + '/';
                        if (entry.type === 'file') {
                            var file = new RemoteFile(entry.name, _this.params, basename);
                            _this.children[entry.name] = file;
                        } else if (entry.type === 'dir') {
                            var directory = new RemoteDirectory(entry.name, _this.params, basename);
                            _this.children[entry.name] = directory;
                        }
                    });
                })
                .error(function (/* response, status */) {
                    console.log('Error in $http get. Unable to update children of remote directory.');
                });
        };

        /* @param entry is a services.filestystem.Local*
         * object. */
        RemoteDirectory.prototype.addEntry = function (entry) {
            if (entry.isFile) {
                var _this = this;
                entry.getContent().then(function (content) {
                    var basename = _this.basename + _this.name + '/';
                    var file = new RemoteFile(entry.name, _this.params, basename);
                    file.create(content).then(function () {
                        _this.children[file.name] = file;
                    });
                });
            }
        };

        RemoteDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        return RemoteDirectory;
    }]);

