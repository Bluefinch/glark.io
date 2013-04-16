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
    .factory('RemoteFile', function (base64, $q, $http) {
        
        var RemoteFile = function (name, params) {
            this.isDirectory = false;
            this.isFile = true;
            
            this.name = name;
            this.basename = '/';
            this.changed = false;
            
            this.params = params;
            this.baseurl =  'http://' + params.adress + ':' + params.port + '/connector/files/';

            this.authenticationHeader = 'Basic ' +
                base64.encode(params.username + ':' + params.password);
        };
        
        RemoteFile.prototype.getContent = function () {
            var defered = $q.defer();
            $http.get(this.baseurl + this.name, {headers: {'Authorization': this.authenticationHeader}})
                .success(function (response) {
                    defered.resolve(response.data.content);
                })
            .error(function (response, status) {
                console.log('Error in $http get. Unable to get content of remote file.');
                console.log(status);
                console.log(response);
            });
            return defered.promise;
        };
        
        return RemoteFile;
    });
