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

    .factory('LocalDirectory', ['$rootScope', 'LocalFile', '$q', function ($rootScope, LocalFile, $q) {

        /* Read the directoryEntry and create a list of
         * services.filesystem.*Local objects. */
        var createEntries = function (basename, directoryEntry) {
            var defered = $q.defer();
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function (entries) {
                var children = {};
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i];
                    if (entry.isFile) {
                        children[entry.name] = new LocalFile(entry.name, entry);
                        children[entry.name].setBasename(basename);
                    } else if (entry.isDirectory) {
                        children[entry.name] = new LocalDirectory(entry.name, entry);
                        children[entry.name].setBasename(basename);
                    }
                }
                defered.resolve(children);
                $rootScope.$apply();
            }, function (err) {
                defered.reject(err);
                $rootScope.$apply();
            });
            return defered.promise;
        };

        var LocalDirectory = function (name, directoryEntry) {
            this.isDirectory = true;
            this.isFile = false;

            this.name = name;
            this.basename = '/';

            this.collapsed = true;
            this.children = {};

            var readyDefered = $q.defer();
            this.readyPromise = readyDefered.promise;
            
            /* If the directoryEntry is not undefined, we
             * read the content and we fill the children
             * collection with the services.filesystem.*Local
             * objects. */
            var _this = this;
            if (directoryEntry !== undefined) {
                var basename = this.basename + this.name + '/';
                var promise = createEntries(basename, directoryEntry);
                promise.then(function (children) {
                    _this.children = children;
                    
                    /* Wait for children to be ready. */
                    var promises = [];
                    angular.forEach(children, function (child) {
                        if (child.isDirectory) {
                            promises.push(child.readyPromise);
                        }
                    });
                    $q.all(promises).then(function () {
                        readyDefered.resolve();
                    });
                });
            } else {
                readyDefered.resolve();
            }
        };
        
        LocalDirectory.prototype.onReady = function (callback) {
            this.readyPromise.then(callback);
        };
        
        /* Set the directory basename.*/
        LocalDirectory.prototype.setBasename = function (basename) {
            var _this = this;
            /* The folder should be ready before updateing
             * the base name. */
            this.onReady(function () {
                _this.basename = basename;
                basename = _this.basename + _this.name + '/';
                angular.forEach(_this.children, function(child) {
                    child.setBasename(basename);
                });
            });
        };

        /* Update the children list. */
        LocalDirectory.prototype.updateChildren = function () {
            /* If the LocalDirectory is ready, it is 
             * up to date. */
            return this.readyPromise;
        };

        /* @param entry is a services.filestystem.Local*
         * object. */
        LocalDirectory.prototype.addEntry = function (entry) {
            entry.setBasename(this.basename + this.name + '/');
            this.children[entry.name] = entry;
        };

        LocalDirectory.prototype.getChildCount = function () {
            return Object.keys(this.children).length;
        };

        return LocalDirectory;
    }]);

