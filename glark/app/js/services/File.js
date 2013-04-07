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
    .factory('File', function (filesystem, basenameFilter, $q) {
        
        var File = function (fileEntry) {
            this.fileEntry = fileEntry;

            this.name = fileEntry.name;
            this.basename = '/';
            if (typeof fileEntry.fullPath !== 'undefined') {
                this.basename = basenameFilter(fileEntry.fullPath);
            }
        };
        
        File.prototype.getContent = function() {
            var promise;
            if (typeof this.fileEntry.file === 'function') {
                var defered = $q.defer();
                this.fileEntry.file(function (blob) {
                    var fsPromise = filesystem.getFileContent(blob);
                    fsPromise.then(function(content) {
                        defered.resolve(content);
                    });
                });
                promise = defered.promise;
            } else {
                promise = filesystem.getFileContent(this.fileEntry);
            }
            return promise;
        };
        
        return File;
    });
