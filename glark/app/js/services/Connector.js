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
    
    /* Create a connector */
    .factory('Connector', function ($resource, $log, workspace, RemoteFile) {
        var address = "192.168.0.3";
        var port = "3001";
        
        var Files = $resource('http://' + address + '\\:' + port + '/files');
        var GetFiles = $resource('http://' + address + '\\:' + port + '/files/:filename', {filename:'@filename'});
        
        var files = Files.get(function() {
            angular.forEach(files.data, function(filename) {
                var file = new RemoteFile(filename, GetFiles);
                workspace.addFile(file);
            });
        });
    });
