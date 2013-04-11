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

    .factory('RemoteDirectory', function (RemoteFile, $q) {
        
        var RemoteDirectory = function (name, connector) {
            this.isDirectory = true;
            this.isFile = false;
            
            this.name = name;
            this.connector = connector;
            
            this.collapsed = true;
            this.children = [];
        };
        
        RemoteDirectory.prototype.updateChildren = function() {
            var _this = this;
            var promise = this.connector.getEntries();
            promise.then(function (entries) {
                _this.children = entries;
            });
        };
        
        return RemoteDirectory;
    });

