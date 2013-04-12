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
    .factory('LocalFile', function ($rootScope, $q) {
        
        var LocalFile = function (entry) {
            this.isDirectory = false;
            this.isFile = true;
            
            /* If the entry is directly a real blob,
             * it could not have a name... */
            this.name = entry.name;
            this.basename = '/';
            
            this.blob = null;
            
            /* Retreive blob from entry. */
            var _this = this;
            if (typeof entry.file === 'function') {
                entry.file(function (blob) {
                    _this.blob = blob;
                });
            } else {
                _this.blob = entry;   
            }
        };
        
        /* Returns the content of the maintened blob. */
        LocalFile.prototype.getContent = function () {
            var defered = $q.defer();
            var reader = new FileReader();
            reader.onload = function (event) {
                defered.resolve(event.target.result);
                $rootScope.$apply();
            };
            reader.readAsText(this.blob);
            return defered.promise;
        };
        
        return LocalFile;
    });
