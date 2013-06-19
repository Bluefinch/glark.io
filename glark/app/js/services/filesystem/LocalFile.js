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
    .factory('LocalFile', ['$rootScope', '$q', function ($rootScope, $q) {

        /* Create a local file from a Blob or a
         * FileEntry object */
        var LocalFile = function (name, entry) {
            this.isDirectory = false;
            this.isFile = true;

            this.name = name;
            this.basename = '/';
            this.changed = false;

            var defered = $q.defer();
            if (entry.file !== undefined) {
                /* entry is a FileEntry object. */
                entry.file(function (file) {
                    defered.resolve(file);
                    $rootScope.$digest();
                });
            } else {
                /* entry is a Blob object. */
                defered.resolve(entry);
            }

            /* Blob property is a promise. */
            this.blob = defered.promise;
        };
        
        /* Set the file basename.*/
        LocalFile.prototype.setBasename = function (basename) {
            this.basename = basename;
        };

        /* Get the content of the maintened blob. */
        LocalFile.prototype.getContent = function () {
            var defered = $q.defer();
            this.blob.then(function (blob) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    defered.resolve(event.target.result);
                    $rootScope.$digest();
                };
                reader.readAsText(blob);
            });
            return defered.promise;
        };

        /* Set the content of the maintened blob. */
        LocalFile.prototype.setContent = function (content) {
            var defered = $q.defer();
            var blob = new Blob([content], {type: this.blob.type});
            defered.resolve(blob);
            /* Blob property should be a promise. */
            this.blob = defered.promise;
            /* Set content should return a promise. */
            return defered.promise;
        };

        /* Make this serializable so that it can be send over the network. */
        LocalFile.prototype.toJSON = function () {
            return {
                basename: this.basename,
                isDirectory: false,
                isFile: true,
                name: this.name
            };
        };

        return LocalFile;
    }]);
