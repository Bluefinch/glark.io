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

    .factory('RemoteDirectory', function (RemoteFile, base64, $q, $http) {
        
        var RemoteDirectory = function (name, params, basename) {
            this.isDirectory = true;
            this.isFile = false;
            
            this.name = name;
            this.basename = '/';
            this.root = true;
            
            if (basename !== undefined) {
                this.basename = basename;
            }
            
            this.collapsed = true;
            this.children = [];

            this.params = params;
            this.baseurl =  'http://' + params.adress + ':' + params.port + '/connector';
            this.baseurl += this.basename + this.name;

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };
        
        RemoteDirectory.prototype.updateChildren = function () {
            /* Set the headers for authentication. */
            $http.headers.Authorization = this.authenticationHeader;

            /* Reset children list. */
            this.children = [];
            
            /* Then update it. */
            var _this = this;
            $http.get(this.baseurl).success(function (response) {
                angular.forEach(response.data, function (entry) {
                    if (entry.type == 'file') {
                        var file = new RemoteFile(entry.name, _this.params);
                        file.basename = _this.basename + _this.name + '/';
                        _this.children.push(file);
                    }
                    else if (entry.type == 'dir') {
                        var basename = _this.basename + _this.name + '/';
                        var directory = new RemoteDirectory(entry.name, _this.params, basename);
                        _this.children.push(directory);
                    }
                });
                
            });
        };
        
        return RemoteDirectory;
    });

